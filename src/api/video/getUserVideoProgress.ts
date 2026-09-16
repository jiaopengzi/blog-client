/*
 * FilePath    : blog-client\src\api\video\getUserVideoProgress.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取用户单一视频观看进度
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 获取用户单一视频观看进度请求
export interface GetUserVideoProgressRequest {
    file_id_hash: string
}

// 获取用户单一视频观看进度响应
export interface GetUserVideoProgressResponse {
    user_id: string
    file_id_hash: string
    last_watch_time_at: number
}

export function getUserVideoProgressAPI(requestData: GetUserVideoProgressRequest): ResPromise<Res<GetUserVideoProgressResponse>> {
    return request({
        url: `${routerGroup}/video/get-user-video-progress`,
        method: "post",
        data: requestData,
    })
}
