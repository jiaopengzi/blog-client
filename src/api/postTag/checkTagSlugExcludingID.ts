/**
 * @FilePath     : \blog-client\src\api\postTag\checkTagSlugExcludingID.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 检查 tag 别名是否存在 (不包含ID)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckTagSlugExcludingIDRequest {
    excluding_id: string // 不包含的ID
    slug: string // tag别名
}

// 检查 tag 名称是否存在
export function checkTagSlugExcludingIDAPI(requestData: CheckTagSlugExcludingIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-tag/check-tag-slug-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
