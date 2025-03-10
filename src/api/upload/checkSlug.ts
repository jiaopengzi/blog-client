/**
 * @FilePath     : \blog-client\src\api\upload\checkSlug.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 检验 slug 是否可用
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckSlugRequest {
    file_id: string // 文件 id
    slug: string // slug
}

// 检验 slug 是否可用
export function checkSlugAPI(requestData: CheckSlugRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/upload/check-slug"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
