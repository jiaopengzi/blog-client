/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 17:24:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 10:00:01
 * @FilePath     : \blog-client\src\api\postTag\checkTagSlug.ts
 * @Description  : 检查 tag 别名是否存在
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckTagSlugRequest {
    slug: string // tag别名
}

// 检查 tag 名称是否存在
export function checkTagSlugAPI(requestData: CheckTagSlugRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post-tag/check-tag-slug"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
