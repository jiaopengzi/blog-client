/**
 * @FilePath     : \blog-client\src\api\request\axios.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : axios封装
 */

import axios from "axios"

import { ResponseCode } from "@/api/response/code"
import { isSetupAPI } from "@/api/setting/isSetup"
import { RouteNames, router } from "@/router"
import { LocalStorageKey } from "@/stores/local"

//1. 创建axios对象
const axiosInstance = axios.create()

//2. 请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        // 添加请求头 token
        const access_token = localStorage.getItem(LocalStorageKey.AccessToken)
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`
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

//3. 响应拦截器
axiosInstance.interceptors.response.use(
    (response) => {
        // 检查响应头是否包含新的 Access Token
        const newAccessToken = response.headers["authorization"]
        if (newAccessToken) {
            // 提取 Access Token（去除 "Bearer" 前缀）
            const token = newAccessToken.split(" ")[1]

            // 更新本地存储的 Access Token（请根据您的项目实际情况进行修改）
            localStorage.setItem(LocalStorageKey.AccessToken, token)
        }
        return response
    },
    (error) => {
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
