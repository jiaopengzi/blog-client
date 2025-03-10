/**
 * @FilePath     : \blog-client\src\api\postCategory\checkCategorySlugExcludingID.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 检查 分类 别名是否存在 (不包含ID)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckCategorySlugExcludingIDRequest {
    excluding_id: string // 不包含的ID
    slug: string // category 别名
}

// 检查 category 名称是否存在
export function checkCategorySlugExcludingIDAPI(requestData: CheckCategorySlugExcludingIDRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-category/check-category-slug-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
