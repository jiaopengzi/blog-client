/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByIsPinned.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照是否置顶统计文章数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface PostCountByIsPinned {
    is_pinned: number // 是否置顶
    count: number // 文章数量
}

export function getPostCountByIsPinnedAPI(): ResPromise<Res<PostCountByIsPinned[]>> {
    const urlStr = routerGroup + "/post/count-by-is-pinned"
    return request({
        url: urlStr,
        method: "get",
    })
}
