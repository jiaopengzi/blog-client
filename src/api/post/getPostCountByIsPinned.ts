/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-20 12:23:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-20 12:30:31
 * @FilePath     : \blog-client\src\api\post\getPostCountByIsPinned.ts
 * @Description  : 按照是否置顶统计文章数量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface PostCountByIsPinned {
    is_pinned: boolean // 是否置顶
    count: number // 文章数量
}

export function getPostCountByIsPinnedAPI(): ResPromise<Res<PostCountByIsPinned[]>> {
    const urlStr = routerGroup + "/post/count-by-is-pinned"
    return request({
        url: urlStr,
        method: "get",
    })
}
