/*
 * FilePath    : blog-client\src\api\helper\getStreamIDStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取streamID状态
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// StreamId 请求参数
export interface StreamIdStatusRequest {
    stream_id: string
}

// StreamIdStatusResWithId 包含 stream_id 的响应
export interface StreamIdStatusResWithId {
    stream_id: string
}

// StreamId 状态
export enum StreamIdStatus {
    UnHandle = "UnHandle", // 未处理
    Handle = "Handle", // 已处理
}

// StreamId 响应
export interface StreamIdStatusRes {
    status: StreamIdStatus
}

export function getStreamIDStatusAPI(requestData: StreamIdStatusRequest): ResPromise<Res<StreamIdStatusRes>> {
    const urlStr = routerGroup + "/helper/stream-id-status"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
