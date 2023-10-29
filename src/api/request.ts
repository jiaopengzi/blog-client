/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-26 23:33:34
 * @FilePath     : \blog-client\src\api\request.ts
 * @Description  : axios封装
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import axios from 'axios'
import { LocalStorageKey } from '@/api/responseCode'

//1. 创建axios对象
const service = axios.create()

//2. 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加请求头 token
    const access_token = localStorage.getItem(LocalStorageKey.AccessToken)
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`
    }

    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

//3. 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 检查响应头是否包含新的 Access Token
    const newAccessToken = response.headers['authorization']
    if (newAccessToken) {
      // 提取 Access Token（去除 "Bearer" 前缀）
      const token = newAccessToken.split(' ')[1]

      // 更新本地存储的 Access Token（请根据您的项目实际情况进行修改）
      localStorage.setItem(LocalStorageKey.AccessToken, token)
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
