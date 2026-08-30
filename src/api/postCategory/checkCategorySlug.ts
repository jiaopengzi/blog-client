/*
 * FilePath    : blog-client-nuxt\src\api\postCategory\checkCategorySlug.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查分类别名是否存在
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckCategorySlugRequest {
    slug: string // category 别名
}

export function checkCategorySlugAPI(requestData: CheckCategorySlugRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-category/check-category-slug"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
