/*
 * FilePath    : blog-client\src\api\video\getUserPostVideoProgress.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取用户视频合集观看进度
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 获取用户视频合集观看进度请求
export interface GetUserPostVideoProgressRequest {
    post_id: string
}

// 获取用户视频合集观看进度响应
export interface GetUserPostVideoProgressResponse {
    user_id: string
    post_id: string
    last_watch_file_id_hash: string
    last_watch_time_at: number
    progress_percent: number
}

export function getUserPostVideoProgressAPI(requestData: GetUserPostVideoProgressRequest): ResPromise<Res<GetUserPostVideoProgressResponse>> {
    return request({
        url: `${routerGroup}/video/get-user-post-video-progress`,
        method: "post",
        data: requestData,
    })
}
