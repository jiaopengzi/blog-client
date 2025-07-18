/**
 * @FilePath     : \blog-client\src\api\postTag\checkTagSlug.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 检查 tag 别名是否存在
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckTagSlugRequest {
    slug: string // tag别名
}

// 检查 tag 名称是否存在
export function checkTagSlugAPI(requestData: CheckTagSlugRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post-tag/check-tag-slug"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
