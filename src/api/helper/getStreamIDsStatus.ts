/*
 * FilePath    : blog-client\src\api\helper\getStreamIDsStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取streamID状态
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// StreamIds 请求参数
export interface StreamIdsStatusRequest {
    stream_ids: string[]
}

// StreamIdsStatusResWithId 包含 stream_id 的响应
export interface StreamIdsStatusResWithId {
    stream_ids: string[]
}

// StreamIds 状态
export enum StreamIdsStatus {
    UnHandle = "UnHandle", // 未处理
    Handle = "Handle", // 已处理
}

// StreamId 响应
export interface StreamIdsStatusRes {
    status: StreamIdsStatus
}

export function getStreamIDsStatusAPI(requestData: StreamIdsStatusRequest): ResPromise<Res<StreamIdsStatusRes>> {
    const urlStr = routerGroup + "/helper/stream-ids-status"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
