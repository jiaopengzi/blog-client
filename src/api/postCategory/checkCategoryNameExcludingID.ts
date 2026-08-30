/*
 * FilePath    : blog-client-nuxt\src\api\postCategory\checkCategoryNameExcludingID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查分类名称是否存在 (不包含 ID)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckCategoryNameExcludingIDRequest {
    excluding_id: string // 不包含的 ID
    name: string // category 名称
}

export function checkCategoryNameExcludingIDAPI(requestData: CheckCategoryNameExcludingIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-category/check-category-name-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
