/**
 * @FilePath     : \blog-client\src\api\request\axios.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : axios封装
 */

import axios from "axios"

import { handleResErr, ResponseCode } from "@/api/response"
import { isSetupAPI } from "@/api/setting/isSetup"
import { RouteNames, router } from "@/router"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

// Bearer 令牌前缀加上空格
const BearerSpace = "Bearer "

// 1. 创建axios对象
const axiosInstance = axios.create()

// 2. 请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()
        // console.log("============>userStore.accessToken", userStore.accessToken)

        // 添加请求头 token
        if (userStore.accessToken) {
            config.headers.Authorization = BearerSpace + userStore.accessToken
        }

        // console.log('config==============>', config)
        // console.log('config.url==============>', config.url)

        return config
    },
    (error) => {
        Promise.reject(error)
    },
)

// 是否已经请求过 isSetupAPI 接口，避免重复请求
let isSetupAPIRequested = false

// 是否已经显示过 用户在其他设备登录 的提示
let isShowUserLoggedInElsewhere = false

// 响应重试计数器和最大重试次数
const retryCount = 0
// 最大重试次数
const maxRetries = 1

// 判断是否需要刷新访问令牌
const needAccessTokenRefresh = (code: number, localRetryCount: number, localMaxRetries: number): boolean => {
    return localMaxRetries < localRetryCount && (code === ResponseCode.UserTokenExpired || code === ResponseCode.UserTokenInvalid)
}

// 3. 响应拦截器
axiosInstance.interceptors.response.use(
    async (response) => {
        // 如果 code 为 UserTokenExpired 尝试刷新访问令牌
        if (needAccessTokenRefresh(response.data.code, retryCount, maxRetries)) {
            const userStore = useUserStore()

            // access token 过期，尝试刷新访问令牌, false 表示不刷新页面
            const isRefresh = await userStore.accessTokenRefresh(false)

            if (isRefresh) {
                // 刷新成功，重新发起原始请求
                const originalRequest = response.config
                originalRequest.headers.Authorization = BearerSpace + userStore.accessToken
                return axiosInstance(originalRequest)
            }
        }

        // 如果用户其他设别登录导致 token 失效，跳转到登录页面
        if (response.data.code === ResponseCode.UserLoggedInElsewhere && !isShowUserLoggedInElsewhere) {
            // 只显示一次提示
            isShowUserLoggedInElsewhere = true

            const userStore = useUserStore()

            // 使用 false 说明当前的token 已经失效，不需要再请求后端接口
            await userStore.logout(false)

            // 跳转到登录页面，并携带当前页面路径，登录成功后跳转回来
            router.push({ name: RouteNames.Login, query: { redirect: router.currentRoute.value.fullPath } })

            // 提示用户
            MessageUtil.warning(handleResErr(response), 6000)
        }

        return response
    },
    async (error) => {
        // 从响应中提取错误信息，判断是不是 404 错误，就请求 isSetupAPI 接口 判断是否已经设置数据库,在 user store 中设置 isSetup
        const { response } = error
        const { status } = response
        // 需要请求 isSetupAPI 接口的状态码
        const needSetupStatus = [404, 502]

        if (needSetupStatus.includes(status) && !isSetupAPIRequested) {
            isSetupAPIRequested = true // 避免重复请求

            isSetupAPI().then((res) => {
                if (res.data.code === ResponseCode.SetupNotCompleted) {
                    // 跳转到 setup 页面
                    router.push({ name: RouteNames.Setup })
                }
            })
        }

        return Promise.reject(error)
    },
)

export default axiosInstance
