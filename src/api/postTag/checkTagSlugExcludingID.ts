/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-05 16:06:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-05 16:07:11
 * @FilePath     : \blog-client\src\api\postTag\checkTagSlugExcludingID.ts
 * @Description  : 检查 tag 别名是否存在 (不包含ID)
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckTagSlugExcludingIDRequest {
    excluding_id: string // 不包含的ID
    slug: string // tag别名
}

// 检查 tag 名称是否存在
export function checkTagSlugExcludingIDAPI(requestData: CheckTagSlugExcludingIDRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-tag/check-tag-slug-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
