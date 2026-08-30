/*
 * FilePath    : blog-client-nuxt\src\api\postCategory\checkCategorySlugExcludingID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查分类别名是否存在 (不包含 ID)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckCategorySlugExcludingIDRequest {
    excluding_id: string // 不包含的 ID
    slug: string // category 别名
}

export function checkCategorySlugExcludingIDAPI(requestData: CheckCategorySlugExcludingIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-category/check-category-slug-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
