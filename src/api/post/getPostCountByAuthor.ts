/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByAuthor.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照作者统计文章数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface PostCountByAuthor {
    post_author: string // 作者ID
    count: number // 文章数量
}

export function getPostCountByAuthorAPI(): ResPromise<Res<PostCountByAuthor[]>> {
    const urlStr = routerGroup + "/post/count-by-author"
    return request({
        url: urlStr,
        method: "get",
    })
}
