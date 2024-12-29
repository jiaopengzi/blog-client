/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-03 14:46:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-13 16:58:31
 * @FilePath     : \blog-client\src\api\post\getPostCountByAuthor.ts
 * @Description  : 按照作者统计文章数量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
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
