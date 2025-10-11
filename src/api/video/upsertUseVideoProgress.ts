/*
 * FilePath    : blog-client\src\api\video\upsertUseVideoProgress.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 保存用户单一视频观看进度
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 保存用户单一视频观看进度请求
export interface UpsertUserVideoProgressRequest {
    file_id_hash: string
    last_watch_time_at: number
}

export function upsertUserVideoProgressAPI(requestData: UpsertUserVideoProgressRequest): ResPromise<Res<void>> {
    return request({
        url: `${routerGroup}/video/upsert-user-video-progress`,
        method: "post",
        data: requestData,
    })
}
