/*
 * FilePath    : blog-client\src\api\link\checkURLExcludingID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查链接 URL 是否存在 (不包含ID)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckURLExcludingIDRequest {
    excluding_id: string // 不包含的ID
    url: string // url
}

// 检查 url 是否存在
export function checkURLExcludingIDAPI(requestData: CheckURLExcludingIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/link/check-ulr-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
