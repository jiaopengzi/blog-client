/**
 * @FilePath     : \blog-client\src\api\postCategory\checkCategorySlug.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 检查 分类 别名是否存在
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckCategorySlugRequest {
    slug: string // category 别名
}

// 检查 category 名称是否存在
export function checkCategorySlugAPI(requestData: CheckCategorySlugRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-category/check-category-slug"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
