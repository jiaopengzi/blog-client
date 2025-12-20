/**
 * FilePath    : blog-client-dev\src\api\user\accessTokenRefresh.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 刷新访问令牌
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type AccessTokenResponse } from "./common"

// 刷新访问令牌
export function accessTokenRefreshAPI(): ResPromise<Res<AccessTokenResponse>> {
    const urlStr = routerGroup + "/user/access-token-refresh-web"
    return request({
        url: urlStr,
        method: "get",
    })
}
