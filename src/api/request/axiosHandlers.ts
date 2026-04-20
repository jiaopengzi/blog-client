/**
 * FilePath    : blog-client\src\api\request\handlers.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 处理逻辑
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

import {
    getIsRefreshing,
    hasRetriedRequest,
    markRetriedRequest,
    notifyRefreshed,
    setIsRefreshing,
    subscribeTokenRefresh,
} from "@/api/request/refreshTokenManager"
import { tabSyncManager } from "@/api/request/tabSyncManager"
import { handleResErr, ResponseCode } from "@/api/response"
import { isSetupAPI } from "@/api/setting/isSetup"
import { RouteNames, router } from "@/router"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

/**
 *  处理 access token 刷新
 * @param response 响应对象
 * @param axiosInstance axios 实例
 * @returns 刷新后的响应结果或 undefined
 */
export async function handleAccessTokenRefresh(response: AxiosResponse, axiosInstance: AxiosInstance): Promise<AxiosResponse | undefined> {
    const code = response.data.code

    // 非刷新相关的响应码, 直接返回 void 0
    if (!(code === ResponseCode.UserTokenExpired || code === ResponseCode.UserTokenInvalid)) return void 0

    // 将原始请求保存下来, 以便重试
    const originalRequest = response.config as AxiosRequestConfig

    // 使用 refreshManager 跟踪, 防止无限重试
    if (hasRetriedRequest(originalRequest)) {
        return Promise.reject(response)
    }

    const userStore = useUserStore()

    // 如果正在刷新, 挂起当前请求等待刷新结果
    if (getIsRefreshing()) {
        return new Promise((resolve, reject) => {
            // 订阅刷新结果
            subscribeTokenRefresh((token, success) => {
                // 刷新完成后重试原始请求
                if (success && token) {
                    // 由于有请求拦截器, 所以不需要手动设置 token
                    markRetriedRequest(originalRequest)
                    resolve(axiosInstance(originalRequest))
                } else {
                    // 刷新失败
                    reject(new Error("token refresh failed"))
                }
            })
        })
    }

    const syncedToken = await tabSyncManager.requestTokenFromOtherTabs(200)
    if (syncedToken) {
        await tabSyncManager.setTokenSilently(syncedToken)
        notifyRefreshed(syncedToken, true)
        markRetriedRequest(originalRequest)
        return axiosInstance(originalRequest)
    }

    // 开始刷新流程 **单例**, 防止重复刷新
    setIsRefreshing(true)
    try {
        const isRefresh = await userStore.accessTokenRefresh(false)
        if (isRefresh) {
            // 刷新成功, 通知等待的请求使用新的 token
            notifyRefreshed(userStore.accessToken, true)

            // 由于有请求拦截器, 所以不需要手动设置 token
            markRetriedRequest(originalRequest)
            return axiosInstance(originalRequest)
        } else {
            // 刷新失败, 通知所有等待的请求失败
            notifyRefreshed(null, false)

            if (userStore.isEditing) {
                MessageUtil.warning("登录已过期，请手动保存您的编辑内容后重新登录", 0)
            }

            return Promise.reject(response)
        }
    } catch (err) {
        // 刷新失败, 通知所有等待的请求失败
        notifyRefreshed(null, false)
        return Promise.reject(err)
    } finally {
        // 兜底, 重置刷新状态
        setIsRefreshing(false)
    }
}

// 处理用户在其他设备登录
export async function handleUserLoggedInElsewhere(response: AxiosResponse) {
    if (response.data.code !== ResponseCode.UserLoggedInElsewhere) return

    const userStore = useUserStore()

    // isRefreshPage=false: 仅清除登录态, 不执行 window.location.href="/" 硬刷新
    // 由下方 router.push 负责 SPA 内跳转到登录页, 避免丢失客户端状态
    await userStore.logout(false, false)

    // 跳转到登录页面, 并携带当前页面路径, 登录成功后跳转回来
    await router.push({ name: RouteNames.Login, query: { redirect: router.currentRoute.value.fullPath } })

    // 提示用户
    MessageUtil.warning(handleResErr(response), 6000)
}

// 处理 setup 状态检查
export function handleSetupStatus(status: number) {
    // 需要请求 isSetupAPI 接口的状态码
    const needSetupStatus = [404, 502]

    // 如果是需要检查 setup 状态的响应码, 则请求 isSetupAPI 接口
    if (needSetupStatus.includes(status)) {
        isSetupAPI().then((res) => {
            if (res.data.code === ResponseCode.SetupNotCompleted) {
                // 跳转到 setup 页面
                router.push({ name: RouteNames.Setup })
            }
        })
    }
}
