/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByStatus.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照文章状态统计文章数量
 */

import { PostStatusCode } from "@/api/post/common"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostType } from "./common"

export interface PostCountByStatus {
    post_status: PostStatusCode // 文章状态
    count: number // 文章数量
}

/**
 * getPostCountByStatusAPI 获取指定文章类型的状态统计。
 * @param postType - 文章类型, 未传时沿用后端默认的 post。
 * @returns 状态维度的文章数量统计结果。
 */
export function getPostCountByStatusAPI(postType?: PostType): ResPromise<Res<PostCountByStatus[]>> {
    const urlStr = routerGroup + "/post/count-by-status"
    return request({
        url: urlStr,
        method: "get",
        params: postType ? { post_type: postType } : void 0,
    })
}
