/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByIsRecommended.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照是否推荐统计文章数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostType } from "./common"

export interface PostCountByIsRecommended {
    is_recommended: number // 是否推荐
    count: number // 文章数量
}

/**
 * getPostCountByIsRecommendedAPI 获取指定文章类型的推荐统计。
 * @param postType - 文章类型, 未传时沿用后端默认的 post。
 * @returns 推荐维度的文章数量统计结果。
 */
export function getPostCountByIsRecommendedAPI(postType?: PostType): ResPromise<Res<PostCountByIsRecommended[]>> {
    const urlStr = routerGroup + "/post/count-by-is-recommended"
    return request({
        url: urlStr,
        method: "get",
        params: postType ? { post_type: postType } : void 0,
    })
}
