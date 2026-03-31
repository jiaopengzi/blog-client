/**
 * FilePath    : blog-client\src\api\request\refreshTokenManager.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : refresh token 管理器, 跟踪刷新状态、订阅者和已重试请求
 */

import type { AxiosRequestConfig } from "axios"

// 是否正在刷新 token
let _isRefreshing = false

// 刷新结果订阅队列, 刷新成功后会通知所有等待的请求重试
let _subscribers: Array<(token: string | null, success: boolean) => void> = []

// 跟踪已经重试过的请求, 避免在请求对象上直接写入 _retry 属性
const _retriedRequests = new WeakSet<AxiosRequestConfig>()

// 获取是否正在刷新 token
export const getIsRefreshing = () => _isRefreshing

// 设置是否正在刷新 token
export const setIsRefreshing = (v: boolean) => {
    _isRefreshing = v
}

// 订阅刷新结果, 当刷新完成时调用回调函数
export const subscribeTokenRefresh = (cb: (token: string | null, success: boolean) => void) => {
    _subscribers.push(cb)
}

// 通知所有订阅者刷新结果, 并清空订阅队列
export const notifyRefreshed = (token: string | null, success: boolean) => {
    _subscribers.forEach((cb) => cb(token, success))
    _subscribers = []
}

// 检查请求是否已经重试过
export const hasRetriedRequest = (req: AxiosRequestConfig) => _retriedRequests.has(req)

// 标记请求为已重试
export const markRetriedRequest = (req: AxiosRequestConfig) => _retriedRequests.add(req)
