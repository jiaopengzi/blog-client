/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-07 09:29:08
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-13 18:17:12
 * @FilePath     : \blog-client\src\api\upload\checkSlug.ts
 * @Description  : 检验 slug 是否可用
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
