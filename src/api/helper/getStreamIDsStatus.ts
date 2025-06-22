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
export interface StreamInfo {
    name: string
    id: string
}
// StreamIds 请求参数
export interface StreamsStatusRequest {
    items: StreamInfo[]
}

// StreamsStatusRes 包含 stream_id 的响应
export interface StreamsStatusRes {
    items: StreamInfo[]
}

// StreamIds 状态
export enum StreamsStatus {
    UnHandle = "UnHandle", // 未处理
    Handle = "Handle", // 已处理
}

// StreamId 响应
export interface StreamsStatusRes {
    status: StreamsStatus
}

export function getStreamIDsStatusAPI(requestData: StreamsStatusRequest): ResPromise<Res<StreamsStatusRes>> {
    const urlStr = routerGroup + "/helper/streams-status"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
