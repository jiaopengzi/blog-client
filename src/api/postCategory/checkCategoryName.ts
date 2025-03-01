/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 14:33:52
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 13:11:56
 * @FilePath     : \blog-client\src\api\postCategory\checkCategoryName.ts
 * @Description  : 检查分类名称是否存在
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
