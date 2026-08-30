/*
 * FilePath    : blog-client-nuxt\src\api\post\checkPostSlugExcludingID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查 post 别名是否存在 (不包含 ID)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckPostSlugExcludingIDRequest {
    excluding_id: string // 不包含的 ID
    slug: string // post 别名
}

// 检查 post 别名是否存在
export function checkPostSlugExcludingIDAPI(requestData: CheckPostSlugExcludingIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post/check-post-slug-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
