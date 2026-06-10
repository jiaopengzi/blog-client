/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByIsPinned.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照是否置顶统计文章数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type PostType } from "./common"

export interface PostCountByIsPinned {
    is_pinned: number // 是否置顶
    count: number // 文章数量
}

/**
 * getPostCountByIsPinnedAPI 获取指定文章类型的置顶统计。
 * @param postType - 文章类型, 未传时沿用后端默认的 post。
 * @returns 置顶维度的文章数量统计结果。
 */
export function getPostCountByIsPinnedAPI(postType?: PostType): ResPromise<Res<PostCountByIsPinned[]>> {
    const urlStr = routerGroup + "/post/count-by-is-pinned"
    return request({
        url: urlStr,
        method: "get",
        params: postType ? { post_type: postType } : void 0,
    })
}
