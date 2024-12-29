/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-29 12:37:34
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:42:57
 * @FilePath     : \blog-client\src\api\request\axios.ts
 * @Description  : axios封装
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import axios from "axios"
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
        return Promise.reject(error)
    },
)

export default axiosInstance
