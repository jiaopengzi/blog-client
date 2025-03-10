/**
 * @FilePath     : \blog-client\src\api\postCategory\checkCategoryName.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 检查分类名称是否存在
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckCategoryNameRequest {
    name: string // tag名称
}

// 检查 分类 名称是否存在
export function checkCategoryNameAPI(requestData: CheckCategoryNameRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-category/check-category-name"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
