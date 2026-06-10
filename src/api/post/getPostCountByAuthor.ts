/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByAuthor.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照作者统计文章数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostType } from "./common"

export interface PostCountByAuthor {
    post_author: string // 作者ID
    count: number // 文章数量
}

/**
 * getPostCountByAuthorAPI 获取指定文章类型的作者统计。
 * @param postType - 文章类型, 未传时沿用后端默认的 post。
 * @returns 作者维度的文章数量统计结果。
 */
export function getPostCountByAuthorAPI(postType?: PostType): ResPromise<Res<PostCountByAuthor[]>> {
    const urlStr = routerGroup + "/post/count-by-author"
    return request({
        url: urlStr,
        method: "get",
        params: postType ? { post_type: postType } : void 0,
    })
}
