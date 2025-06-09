/*
 * FilePath    : blog-client\src\api\link\checkURL.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查链接 URL 是否存在
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckURLRequest {
    url: string // 链接地址
}

// 检查 url 是否存在
export function checkURLAPI(requestData: CheckURLRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/link/check-url"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
