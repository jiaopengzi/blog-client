/*
 * FilePath    : blog-client-nuxt\src\api\request\ofetch.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 统一请求层 (阶段 1 重写: ofetch 替代 axios)
 */

/*
 * 补充说明:
 * 计划 1.2/1.3: SSR 与客户端共用同一套 API 函数.
 * - SSR (无 window): baseURL = process.env.NUXT_API_BASE, 直连后端
 * - 浏览器: baseURL 为空, 走同源相对路径 (dev 由 devServer.proxy 转发 /api)
 * - 保持 axios 风格的调用签名 request({ url, method, data, params }) 与响应形状
 *   { data, status, statusText, headers, config }, 200+ 个 api 模块零改动
 * - token 刷新/重试逻辑仅客户端生效 (ofetchHandlers 内部有环境守卫)
 * - 上传进度 (阶段 6): fetch/ofetch 无上传进度事件, 浏览器端且调用方传入
 *   onUploadProgress 时改走 XHR 发送 (与 SPA axios 的 onUploadProgress 行为一致)
 */

import { $fetch, type FetchError, type FetchResponse } from "ofetch"

import { ResponseCode } from "@/api/response"
import { useUserStore } from "@/stores/user"

import { resolveApiBase } from "./base"
import { handleAccessTokenRefresh, handleSetupStatus, handleUserLoggedInElsewhere } from "./ofetchHandlers"
import type { ReqProgressEvent } from "./types"

// ---------------------------------------------------------------------------
// 类型定义 (兼容 axios 风格的响应形状)
// ---------------------------------------------------------------------------

// 请求配置 (axios 风格签名, api 模块零改动复用)
export interface RequestConfig {
    url: string
    method?: string
    data?: unknown
    params?: Record<string, unknown>
    headers?: Record<string, string>
    timeout?: number
    // 上传进度回调 (浏览器端经 XHR 实现; SSR 环境忽略)
    onUploadProgress?: (progressEvent: ReqProgressEvent) => void
}

// 响应形状 (对齐 axios response 常用字段)
export interface OfetchResponse<T = unknown> {
    data: T
    status: number
    statusText: string
    headers: Record<string, string>
    config: RequestConfig
}

// 请求错误 (对齐 axios error 常用字段: response.status / response.data)
export interface OfetchRequestError extends Error {
    response?: {
        data: unknown
        status: number
        statusText: string
        headers: Record<string, string>
        config: RequestConfig
    }
}

// ---------------------------------------------------------------------------
// 内部实现
// ---------------------------------------------------------------------------

// 是否已经请求过 isSetupAPI 接口, 避免重复请求
let isSetupAPIRequested = false

// 写方法集合 (ofetch 默认重试策略仅覆盖 GET 等幂等方法)
const PAYLOAD_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])

/**
 * isPayloadMethod 判断 HTTP 方法是否为携带请求体的写方法.
 * @param method - 大写 HTTP 方法名.
 * @returns true 表示写方法.
 */
function isPayloadMethod(method: string): boolean {
    return PAYLOAD_METHODS.has(method)
}

// 是否已经显示过 用户在其他设备登录 的提示
let isShowUserLoggedInElsewhere = false

// ofetch 实例: 保留默认重试语义——GET 等幂等请求在瞬时网络错误 (无响应, 含 SPA 切页后首个请求
// 命中浏览器 keep-alive 连接竞态导致的 Failed to fetch) 与 5xx 时自动重试一次;
// POST/PUT/PATCH/DELETE 等写方法默认不重试 (避免重复写). 业务 401 token 刷新仍由 refresh 逻辑统一处理.
const http = $fetch.create({})

// 构建请求头: 附加 Bearer token (仅客户端, 读 pinia userStore)
function buildHeaders(extraHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = { ...extraHeaders }

    // SSR 不携带用户 token (计划 0.11.a: 公开接口无鉴权直出)
    if (typeof window === "undefined") {
        return headers
    }

    // 延迟读取 store (静态导入存在循环依赖: ofetch -> stores/user -> api/user/* -> request,
    // 但 useUserStore 仅在请求运行时调用, 模块初始化期无副作用, 与原项目 axios.ts 做法一致)
    const accessToken = useUserStore().accessToken
    if (accessToken) {
        headers.Authorization = "Bearer " + accessToken
    }

    return headers
}

// 将 FetchResponse 塑形为 axios 风格响应
function shapeResponse<T>(res: FetchResponse<T>, config: RequestConfig): OfetchResponse<T> {
    return {
        data: res._data as T,
        status: res.status,
        statusText: res.statusText || "",
        headers: Object.fromEntries(new Headers(res.headers).entries()),
        config,
    }
}

// 将 FetchError 塑形为 axios 风格错误
function shapeError(err: FetchError, config: RequestConfig): OfetchRequestError {
    const axiosStyleResponse = err.response
        ? {
              data: err.response._data,
              status: err.response.status,
              statusText: err.response.statusText || "",
              headers: Object.fromEntries(new Headers(err.response.headers).entries()),
              config,
          }
        : undefined

    return Object.assign(new Error(err.message || "request failed"), {
        name: err.name,
        response: axiosStyleResponse,
        cause: err.cause,
    }) as OfetchRequestError
}

// 解析 XHR 响应体: JSON 优先, 解析失败回退原始文本
function parseXhrResponseData(text: string): unknown {
    if (!text) {
        return null
    }
    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}

// 将 XHR getAllResponseHeaders() 的原始文本解析为 headers 对象 (键小写, 与 Headers 行为一致)
function parseXhrHeaders(raw: string): Record<string, string> {
    const headers: Record<string, string> = {}
    for (const line of raw.trim().split(/[\r\n]+/)) {
        const idx = line.indexOf(":")
        if (idx === -1) continue
        const key = line.slice(0, idx).trim().toLowerCase()
        const value = line.slice(idx + 1).trim()
        if (key) {
            headers[key] = value
        }
    }
    return headers
}

// 成功响应的统一业务处理: token 刷新重放 + 异地登录提示 (与 ofetch 原路径共用)
async function applyResponseHandlers<T>(shaped: OfetchResponse<T>, config: RequestConfig): Promise<OfetchResponse<T>> {
    // 业务级 token 刷新逻辑 (服务端直接跳过, 不刷新不重试)
    const refreshResult = await handleAccessTokenRefresh(shaped, config)
    if (refreshResult !== undefined) {
        return refreshResult
    }

    // 用户在其他设备登录的处理 (只执行一次)
    if ((shaped.data as { code?: number } | null)?.code === ResponseCode.UserLoggedInElsewhere && !isShowUserLoggedInElsewhere) {
        isShowUserLoggedInElsewhere = true
        await handleUserLoggedInElsewhere(shaped)
    }

    return shaped
}

/**
 * 基于 XHR 的请求实现 (仅浏览器端): 支持上传进度回调 onUploadProgress.
 * 响应与错误均塑形为 axios 风格 (与 ofetch 路径一致), 业务处理复用 applyResponseHandlers.
 */
function requestWithXhrProgress<T>(url: string, config: RequestConfig): Promise<OfetchResponse<T>> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const method = (config.method || "get").toUpperCase()
        const isFormData = typeof FormData !== "undefined" && config.data instanceof FormData

        xhr.open(method, url, true)
        if (config.timeout) {
            xhr.timeout = config.timeout
        }

        // 请求头: buildHeaders 附加 Authorization; FormData 的 Content-Type 交由浏览器
        // 自动生成 (携带 multipart boundary), 显式设置的其他头原样透传
        const headers = buildHeaders(config.headers)
        for (const [key, value] of Object.entries(headers)) {
            if (value === undefined || value === null) continue
            if (isFormData && key.toLowerCase() === "content-type") continue
            xhr.setRequestHeader(key, value)
        }

        // 上传进度: lengthComputable 时计算 0-1 进度 (与 axios ProgressEvent 语义对齐)
        xhr.upload.addEventListener("progress", (event: ProgressEvent) => {
            const lengthComputable = event.lengthComputable && event.total > 0
            const progressEvent: ReqProgressEvent = {
                loaded: event.loaded,
                total: event.total,
                lengthComputable: event.lengthComputable,
                progress: lengthComputable ? event.loaded / event.total : undefined,
            }
            config.onUploadProgress?.(progressEvent)
        })

        // 响应塑形: HTTP 2xx 走业务处理; HTTP 错误抛 axios 风格错误 (含 response),
        // 与 ofetch 路径 catch 分支的 setup 状态检查保持一致
        xhr.addEventListener("load", () => {
            const shaped: OfetchResponse<T> = {
                data: parseXhrResponseData(xhr.responseText) as T,
                status: xhr.status,
                statusText: xhr.statusText || "",
                headers: parseXhrHeaders(xhr.getAllResponseHeaders()),
                config,
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                applyResponseHandlers(shaped, config).then(resolve, reject)
                return
            }

            const shapedError = Object.assign(new Error(xhr.statusText || "request failed"), {
                name: "Error",
                response: shaped,
            }) as OfetchRequestError

            // 处理 isSetupAPI 状态 (只执行一次)
            if (!isSetupAPIRequested) {
                handleSetupStatus(shaped.status)
                isSetupAPIRequested = true
            }

            reject(shapedError)
        })

        // 网络级错误 (无 response, 与 axios 网络错误语义一致)
        xhr.addEventListener("error", () => {
            reject(Object.assign(new Error("request failed"), { name: "Error", response: undefined }) as OfetchRequestError)
        })

        // 超时 (与 axios timeout 语义一致)
        xhr.addEventListener("timeout", () => {
            reject(
                Object.assign(new Error(`timeout of ${config.timeout ?? 0}ms exceeded`), { name: "TimeoutError", response: undefined }) as OfetchRequestError,
            )
        })

        if (config.data instanceof FormData) {
            xhr.send(config.data as FormData)
        } else if (config.data !== undefined && config.data !== null) {
            xhr.send(JSON.stringify(config.data))
        } else {
            xhr.send()
        }
    })
}

// ---------------------------------------------------------------------------
// 对外入口
// ---------------------------------------------------------------------------

/**
 * @description: 统一请求入口 (SSR/CSR 共用).
 * 成功路径: token 过期/无效时 (仅客户端) 自动刷新并重放请求;
 * 失败路径: HTTP 错误透传 (带 axios 风格 response), setup 状态检查只触发一次.
 * 上传进度: 浏览器端调用方传入 onUploadProgress 时改走 XHR 发送.
 * @remarks 默认泛型为 any, 对齐原项目 axios 的 AxiosPromise<any> 语义 (api 模块多为返回类型标注式推断)
 */
export async function request<T = any>(config: RequestConfig): Promise<OfetchResponse<T>> {
    // 绝对地址 (如公网 ip 查询) 不拼接后端 baseURL
    const url = /^https?:\/\//i.test(config.url) ? config.url : resolveApiBase() + config.url

    // 上传进度 (阶段 6): fetch/ofetch 无法监听上传进度, 浏览器端且调用方传入
    // onUploadProgress 时改走 XHR 发送 (与 SPA axios 的 onUploadProgress 行为一致)
    if (typeof window !== "undefined" && typeof XMLHttpRequest !== "undefined" && typeof config.onUploadProgress === "function") {
        return requestWithXhrProgress<T>(url, config)
    }

    // 请求头: FormData 请求体的 Content-Type 交由浏览器生成 (自动携带 multipart boundary).
    // 显式传 "multipart/form-data" (无 boundary) 会让分片上传等 multipart 请求无效:
    // dev 代理直接重置连接、后端解析失败 (axios 对 FormData 同样剥除用户设置的 Content-Type).
    const isFormData = typeof FormData !== "undefined" && config.data instanceof FormData
    const requestHeaders = buildHeaders(config.headers)
    if (isFormData) {
        delete requestHeaders["content-type"]
        delete requestHeaders["Content-Type"]
    }

    const opts: Record<string, unknown> = {
        method: (config.method || "get").toUpperCase(),
        body: config.data,
        query: config.params,
        headers: requestHeaders,
        timeout: config.timeout,
    }

    try {
        const res = await http.raw<T>(url, opts)
        return await applyResponseHandlers(shapeResponse(res, config), config)
    } catch (err) {
        const fetchError = err as FetchError

        // 瞬时网络错误重试: SPA 切页后首个请求可能命中浏览器 keep-alive 连接竞态
        // (无响应 Failed to fetch, 请求未真正到达服务端). GET 已由 ofetch 默认重试覆盖;
        // 写方法默认不重试, 这里仅对"无响应"错误补一次重试; 有响应 (4xx/5xx) 不重试,
        // 避免服务端已处理但响应丢失时重复提交写操作.
        if (typeof window !== "undefined" && !fetchError.response && isPayloadMethod((config.method || "get").toUpperCase())) {
            try {
                const retryRes = await http.raw<T>(url, opts)
                return await applyResponseHandlers(shapeResponse(retryRes, config), config)
            } catch {
                // 重试仍失败, 继续走下方错误塑形与抛出
            }
        }

        const shapedError = shapeError(fetchError, config)

        // 处理 isSetupAPI 状态 (只执行一次)
        if (fetchError.response && !isSetupAPIRequested) {
            handleSetupStatus(fetchError.response.status)
            isSetupAPIRequested = true
        }

        throw shapedError
    }
}
