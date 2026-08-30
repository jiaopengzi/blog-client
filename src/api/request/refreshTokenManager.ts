/*
 * FilePath    : blog-client-nuxt\src\api\request\refreshTokenManager.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : refresh token 管理器, 跟踪刷新状态、订阅者和已重试请求 (阶段 1 重写: 去除 axios 依赖)
 */

import type { RequestConfig } from "./ofetch"

let isRefreshing = false

// 刷新结果订阅队列, 刷新成功后会通知所有等待的请求重试
let subscribers: Array<(token: string | null, success: boolean) => void> = []

// 跟踪已经重试过的请求, 避免在请求对象上直接写入 _retry 属性
const retriedRequests = new WeakSet<object>()

export const getIsRefreshing = () => isRefreshing

export const setIsRefreshing = (v: boolean) => {
    isRefreshing = v
}

export const subscribeTokenRefresh = (cb: (token: string | null, success: boolean) => void) => {
    subscribers.push(cb)
}

// 通知所有订阅者刷新结果, 并清空订阅队列
export const notifyRefreshed = (token: string | null, success: boolean) => {
    subscribers.forEach((cb) => cb(token, success))
    subscribers = []
}

export const hasRetriedRequest = (req: RequestConfig) => retriedRequests.has(req)

export const markRetriedRequest = (req: RequestConfig) => retriedRequests.add(req)
