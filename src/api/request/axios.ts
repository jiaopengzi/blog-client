/**
 * @FilePath     : \blog-client\src\api\request\axios.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : axios封装
 */

import axios from "axios"

import { ResponseCode } from "@/api/response"
import { useUserStore } from "@/stores/user"

import { handleAccessTokenRefresh, handleSetupStatus, handleUserLoggedInElsewhere } from "./axiosHandlers"

// Bearer 令牌前缀加上空格
const BearerSpace = "Bearer "

// 1. 创建axios对象
const axiosInstance = axios.create()

// 2. 请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()

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

// 是否已经请求过 isSetupAPI 接口, 避免重复请求
let isSetupAPIRequested = false

// 是否已经显示过 用户在其他设备登录 的提示
let isShowUserLoggedInElsewhere = false

// 3. 响应拦截器
axiosInstance.interceptors.response.use(
    async (response) => {
        // 处理 access token 刷新逻辑, 如果处理则返回结果
        const refreshResult = await handleAccessTokenRefresh(response, axiosInstance)
        if (refreshResult !== void 0) return refreshResult

        // 用户在其他设备登录的处理(只执行一次)
        if (response.data.code === ResponseCode.UserLoggedInElsewhere && !isShowUserLoggedInElsewhere) {
            isShowUserLoggedInElsewhere = true
            await handleUserLoggedInElsewhere(response)
        }

        // 常规的返回响应
        return response
    },

    async (error) => {
        // 从响应中提取错误信息并交给 handler 处理
        const { response } = error
        const { status } = response

        // 处理 isSetupAPI 状态(只执行一次)
        if (!isSetupAPIRequested) {
            handleSetupStatus(status)
            isSetupAPIRequested = true
        }

        // 常规的错误返回
        return Promise.reject(error)
    },
)

export default axiosInstance
