/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 09:57:31
 * @FilePath     : \blog-client\src\api\postCategory\checkCategorySlugExcludingID.ts
 * @Description  : 检查 分类 别名是否存在 (不包含ID)
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckCategorySlugExcludingIDRequest {
    excluding_id: string // 不包含的ID
    slug: string // category 别名
}

// 检查 category 名称是否存在
export function checkCategorySlugExcludingIDAPI(
    requestData: CheckCategorySlugExcludingIDRequest,
): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-category/check-category-slug-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
