/*
 * FilePath    : blog-client\src\api\video\upsertUserPostVideoProgress.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 保存用户视频合集观看进度
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 保存用户视频合集观看进度请求
export interface UpsertUserPostVideoProgressRequest {
    post_id: string
    last_watch_file_id_hash: string
    last_watch_time_at: number
    progress_percent: number
}

export function upsertUserPostVideoProgressAPI(requestData: UpsertUserPostVideoProgressRequest): ResPromise<Res<void>> {
    return request({
        url: `${routerGroup}/video/upsert-user-post-video-progress`,
        method: "post",
        data: requestData,
    })
}
