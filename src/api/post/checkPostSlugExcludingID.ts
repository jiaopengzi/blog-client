/**
 * @FilePath     : \blog-client\src\api\post\checkPostSlugExcludingID.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 检查 post 别名是否存在 (不包含ID)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckPostSlugExcludingIDRequest {
    excluding_id: string // 不包含的ID
    slug: string // post别名
}

// 检查 post 名称是否存在
export function checkPostSlugExcludingIDAPI(requestData: CheckPostSlugExcludingIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/post/check-post-slug-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
