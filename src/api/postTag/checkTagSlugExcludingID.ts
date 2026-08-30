/*
 * FilePath    : blog-client-nuxt\src\api\postTag\checkTagSlugExcludingID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查 tag 别名是否存在 (不包含 ID)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckTagSlugExcludingIDRequest {
    excluding_id: string // 不包含的 ID
    slug: string // tag 别名
}

export function checkTagSlugExcludingIDAPI(requestData: CheckTagSlugExcludingIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-tag/check-tag-slug-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
