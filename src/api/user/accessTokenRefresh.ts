/*
 * FilePath    : blog-client-nuxt\src\api\user\accessTokenRefresh.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 刷新访问令牌 (阶段 1 重写: axios -> ofetch)
 */

/*
 * 补充说明:
 * 独立的 ofetch 请求, 不经过 request 拦截器, 避免:
 *   1. handleUserLoggedInElsewhere 误触发 logout → 硬刷新首页
 *   2. handleAccessTokenRefresh 递归触发 → 死锁(subscriber 等待自身完成)
 * 同时不发送 Authorization header, 刷新端点仅依赖 refresh token cookie
 */

import { $fetch } from "ofetch"

import { resolveApiBase } from "@/api/request/base"
import { routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type AccessTokenResponse } from "./common"

// 刷新访问令牌
export async function accessTokenRefreshAPI(): ResPromise<Res<AccessTokenResponse>> {
    const urlStr = routerGroup + "/user/access-token-refresh-web"

    // SSR 直连后端; 浏览器走同源相对路径 (cookie 随 same-origin 自动携带)
    const res = await $fetch.raw<Res<AccessTokenResponse>>(resolveApiBase() + urlStr, {
        method: "GET",
        credentials: "same-origin",
    })

    return {
        data: res._data as Res<AccessTokenResponse>,
        status: res.status,
        statusText: res.statusText || "",
        headers: Object.fromEntries(new Headers(res.headers).entries()),
        config: {},
    }
}
