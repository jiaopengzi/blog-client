/*
 * FilePath    : blog-client-nuxt\server\routes\api\[...].ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /api 同源代理(阶段 3 补充; 重构为 h3 proxyRequest 流式转发)
 */

/*
 * 补充说明:
 * dev 模式由 nitro.devProxy 转发 /api; 生产构建无 devProxy,
 * 浏览器端同源 /api 请求需要本路由转发到后端(NUXT_API_BASE)
 * 服务端 SSR 取数不经过本路由(直连 NUXT_API_BASE)
 * 生产部署若由 nginx 反向代理 /api, 则本路由不会被命中(nginx 先拦截)
 * 使用 proxyRequest 流式转发请求体(multipart 分片上传等大体不被缓冲破坏)与
 * 响应头(Set-Cookie 原样回传, 登录态刷新不丢失); 避免手工 readRawBody +
 * $fetch.raw 转发造成的大体损坏(后端 500)与 cookie 丢失
 */

import { getRequestURL, proxyRequest } from "h3"

export default defineEventHandler(async (event) => {
    const { apiBase } = useRuntimeConfig()

    // 未配置后端地址: 明确失败, 避免请求落入 SSR 兜底路由产生误导性 404
    if (!apiBase) {
        throw createError({ statusCode: 502, message: "未配置后端 API 地址（NUXT_API_BASE）" })
    }

    const url = getRequestURL(event)
    const target = `${apiBase}${url.pathname}${url.search}`

    try {
        // 原样透传请求(方法/请求头含 authorization 与 cookie/请求体), 响应(状态码/头/体)原样回传
        return await proxyRequest(event, target)
    } catch (error: unknown) {
        // 网络级失败: 502, 避免 500 堆栈暴露
        console.error("[api-proxy] 转发失败:", error instanceof Error ? error.message : error)
        throw createError({ statusCode: 502, message: "后端服务不可用" })
    }
})
