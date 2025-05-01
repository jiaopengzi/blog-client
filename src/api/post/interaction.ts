/*
 * FilePath    : blog-client\src\api\post\interaction.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章交互
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 交互请求
export interface InteractionRequest {
    post_id: string // 文章ID
}

// 交互结果
export interface InteractionResData {
    like: boolean // 是否点赞
    star: boolean // 是否收藏
}

// 获取文章交互状态
export function postInteractionAPI(requestData: InteractionRequest): ResPromise<Res<InteractionResData>> {
    const urlStr = routerGroup + "/post/interaction-status"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
