/*
 * FilePath    : blog-client-nuxt\src\api\request\ofetchHandlers.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 请求处理逻辑 (阶段 1 重写: axios -> ofetch, SSR 环境守卫)
 */

/*
 * 补充说明:
 * 对应原项目 axiosHandlers.ts. token 刷新/重放、异地登录、setup 检查均为客户端行为,
 * 服务端请求 (无 window) 直接跳过刷新与提示逻辑.
 */

import { navigateTo } from "#imports"

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
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

import { request, type OfetchResponse, type RequestConfig } from "./ofetch"

/**
 * @description: 处理 access token 刷新 (仅客户端生效; SSR 直接返回 undefined)
 * @param response 塑形后的响应对象
 * @param config 原始请求配置
 * @returns 刷新并重放后的响应结果; 无需处理时返回 undefined
 */
export async function handleAccessTokenRefresh<T>(response: OfetchResponse<T>, config: RequestConfig): Promise<OfetchResponse<T> | undefined> {
    // SSR 环境不携带 token、不刷新、不重试
    if (typeof window === "undefined") return undefined

    const code = (response.data as { code?: number } | null)?.code

    // 非刷新相关的响应码, 直接返回 void 0
    if (!(code === ResponseCode.UserTokenExpired || code === ResponseCode.UserTokenInvalid)) return undefined

    // 使用 refreshManager 跟踪, 防止无限重试
    if (hasRetriedRequest(config)) {
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
                    markRetriedRequest(config)
                    resolve(request<T>(config))
                } else {
                    // 刷新失败
                    reject(new Error("token refresh failed"))
                }
            })
        })
    }

    // 提前设置刷新标志位, 消灭 getIsRefreshing 检查与 setIsRefreshing 之间的异步竞态窗口,
    // 避免多个请求同时检测到 token 过期后并发触发刷新 API, 导致后端 JWI 不匹配误判为"其他设备登录".
    setIsRefreshing(true)
    try {
        // 优先尝试从其他标签页同步 token, 避免不必要的后端刷新调用
        const syncedToken = await tabSyncManager.requestTokenFromOtherTabs(200)
        if (syncedToken) {
            await tabSyncManager.setTokenSilently(syncedToken)
            notifyRefreshed(syncedToken, true)
            markRetriedRequest(config)
            return request<T>(config)
        }

        // 其他标签页无可用 token, 调用后端刷新 API
        const isRefresh = await userStore.accessTokenRefresh(false)
        if (isRefresh) {
            // 刷新成功, 通知等待的请求使用新的 token
            notifyRefreshed(userStore.accessToken, true)

            // 由于有请求拦截器, 所以不需要手动设置 token
            markRetriedRequest(config)
            return request<T>(config)
        }

        // 刷新失败, 通知所有等待的请求失败
        notifyRefreshed(null, false)

        if (userStore.isEditing) {
            MessageUtil.warning("登录已过期，请手动保存您的编辑内容后重新登录", 0)
        }

        return Promise.reject(response)
    } catch (err) {
        // 刷新失败, 通知所有等待的请求失败
        notifyRefreshed(null, false)
        return Promise.reject(err)
    } finally {
        // 兜底, 重置刷新状态
        setIsRefreshing(false)
    }
}

/**
 * @description: 处理用户在其他设备登录 (仅客户端生效)
 * @param response 塑形后的响应对象
 */
export async function handleUserLoggedInElsewhere(response: OfetchResponse<unknown>): Promise<void> {
    if (typeof window === "undefined") return
    if ((response.data as { code?: number } | null)?.code !== ResponseCode.UserLoggedInElsewhere) return

    const userStore = useUserStore()

    // isRefreshPage=false: 仅清除登录态, 不执行 window.location.href="/" 硬刷新
    // 由下方跳转负责前往登录页, 避免丢失客户端状态
    await userStore.logout(false, false)

    // 跳转到登录页面, 并携带当前页面路径, 登录成功后跳转回来
    // TODO(阶段 2): SPA 路由就绪后改用 navigateTo/useRouter 软导航
    const redirect = encodeURIComponent(window.location.pathname + window.location.search)
    window.location.assign(`/login?redirect=${redirect}`)

    // 提示用户
    MessageUtil.warning(handleResErr(response as never), 6000)
}

/**
 * @description: 处理 setup 状态检查 (仅客户端生效; 动态导入 isSetupAPI 断开循环依赖)
 * @param status HTTP 状态码
 */
export function handleSetupStatus(status: number): void {
    if (typeof window === "undefined") return

    // 需要请求 isSetupAPI 接口的状态码
    const needSetupStatus = [404, 502]

    // 如果是需要检查 setup 状态的响应码, 则请求 isSetupAPI 接口
    if (needSetupStatus.includes(status)) {
        void import("@/api/setting/isSetup").then(({ isSetupAPI }) => {
            void isSetupAPI()
                .then(async (res) => {
                    if (res.data.code === ResponseCode.SetupNotCompleted) {
                        // SPA 对齐: 软导航跳转 (原 axiosHandlers 为 router.push).
                        // window.location.assign 会整页刷新: /setup 每次重载都会重新触发
                        // options 等请求 → 404 → 再次 assign, 形成无限刷新循环.
                        // 已在 setup 页时直接跳过 (软导航到当前页无意义且会重复检查).
                        if (window.location.pathname === "/setup") {
                            return
                        }
                        await navigateTo("/setup")
                    }
                })
                .catch(() => {
                    // setup 检查失败 (后端不可用等) 静默忽略, 避免未处理 Promise 拒绝
                })
        })
    }
}
