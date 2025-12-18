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
    stream_items: StreamInfo[]
}

// StreamsStatusRes 包含 stream_id 的响应
export interface StreamsStatusRes {
    stream_items: StreamInfo[]
}

// StreamIds 状态
export enum StreamStatus {
    UnHandle = "UnHandle", // 未处理
    HandleSuccess = "HandleSuccess", // 已处理 成功
    HandleFailed = "HandleFailed", // 已处理 失败
}

// 所有 stream_id 的状态响应
export interface StreamAllStatusRes {
    status_all: StreamStatus
}

export function getStreamIDsStatusAPI(requestData: StreamsStatusRequest): ResPromise<Res<StreamAllStatusRes>> {
    const urlStr = routerGroup + "/helper/streams-status"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
