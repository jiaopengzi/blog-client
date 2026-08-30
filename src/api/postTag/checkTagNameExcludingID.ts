/*
 * FilePath    : blog-client-nuxt\src\api\postTag\checkTagNameExcludingID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查 tag 名称是否存在 (不包含 ID)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckTagNameExcludingIDRequest {
    excluding_id: string // 不包含的 ID
    name: string // tag 名称
}

export function checkTagNameExcludingIDAPI(requestData: CheckTagNameExcludingIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-tag/check-tag-name-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
