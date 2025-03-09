/**
 * @FilePath     : \blog-client\src\api\post\getPostCountByIsRecommended.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 按照是否推荐统计文章数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface PostCountByIsRecommended {
    is_recommended: number // 是否推荐
    count: number // 文章数量
}

export function getPostCountByIsRecommendedAPI(): ResPromise<Res<PostCountByIsRecommended[]>> {
    const urlStr = routerGroup + "/post/count-by-is-recommended"
    return request({
        url: urlStr,
        method: "get",
    })
}
