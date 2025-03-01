/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-05 16:06:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-10 16:49:01
 * @FilePath     : \blog-client\src\api\post\checkPostSlugExcludingID.ts
 * @Description  : 检查 post 别名是否存在 (不包含ID)
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckPostSlugExcludingIDRequest {
    excluding_id: string // 不包含的ID
    slug: string // post别名
}

// 检查 post 名称是否存在
export function checkPostSlugExcludingIDAPI(requestData: CheckPostSlugExcludingIDRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/post/check-post-slug-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
