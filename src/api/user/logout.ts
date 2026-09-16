/*
 * FilePath    : blog-client\src\api\user\logout.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用户登出
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 用户登出
export function logoutAPI(): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/logout"
    return request({
        url: urlStr,
        method: "get",
    })
}
