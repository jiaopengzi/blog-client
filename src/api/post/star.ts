/*
 * FilePath    : blog-client\src\api\post\star.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 星标、收藏
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 星标、收藏请求
export interface PostStarRequest {
    post_id: string // 文章ID
    star: boolean // 星标、收藏或取消星标、收藏
}

// 星标、收藏结果
export interface PostStarResData {
    count: string // 互动后的星标、收藏数量
}

// 设置文章星标、收藏状态
export function setPostStarAPI(requestData: PostStarRequest): ResPromise<Res<PostStarResData>> {
    const urlStr = routerGroup + "/post/star"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
