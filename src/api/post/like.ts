/*
 * FilePath    : blog-client\src\api\post\like.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 点赞
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 点赞请求
export interface PostLikeRequest {
    post_id: string // 文章ID
    like: boolean // 点赞或取消点赞
}

// 点赞结果
export interface PostLikeResData {
    count: string // 互动后的点赞数量
}

// 设置文章点赞状态
export function setPostLikeAPI(requestData: PostLikeRequest): ResPromise<Res<PostLikeResData>> {
    const urlStr = routerGroup + "/post/like"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
