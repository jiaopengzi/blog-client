/**
 * FilePath    : blog-client\src\api\user\accessTokenRefresh.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 刷新访问令牌
 */

import axios from "axios"

import { routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type AccessTokenResponse } from "./common"

// 独立的 axios 实例, 不注册任何拦截器
// 避免刷新请求的响应被响应拦截器二次处理, 导致:
//   1. handleUserLoggedInElsewhere 误触发 logout → window.location.href = "/" 硬刷新首页
//   2. handleAccessTokenRefresh 递归触发 → 死锁(subscriber 等待自身完成)
// 同时不发送 Authorization header, 刷新端点仅依赖 refresh token cookie
const refreshAxios = axios.create()

// 刷新访问令牌
export function accessTokenRefreshAPI(): ResPromise<Res<AccessTokenResponse>> {
    const urlStr = routerGroup + "/user/access-token-refresh-web"
    return refreshAxios({
        url: urlStr,
        method: "get",
    })
}
