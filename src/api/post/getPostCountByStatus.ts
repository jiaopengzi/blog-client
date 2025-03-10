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

export interface PostCountByStatus {
    post_status: PostStatusCode // 文章状态
    count: number // 文章数量
}

export function getPostCountByStatusAPI(): ResPromise<Res<PostCountByStatus[]>> {
    const urlStr = routerGroup + "/post/count-by-status"
    return request({
        url: urlStr,
        method: "get",
    })
}
