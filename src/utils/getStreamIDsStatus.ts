/*
 * FilePath    : blog-client\src\utils\getStreamIDsStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取streamID状态
 */

import { getStreamIDsStatusAPI, type StreamsStatusRequest, StreamStatus } from "@/api/helper/getStreamIDsStatus"
import { type StreamInfo } from "@/api/helper/getStreamIDsStatus"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

/**
 * 递归轮询获取stream状态(内部使用)
 * @param streams stream 列表
 * @param startTime 开始时间
 * @param pollingTime 轮询间隔时间
 * @param timeOut 超时时间
 * @returns Promise<void>
 */
async function poll(streams: StreamInfo[], startTime: number, pollingTime: number, timeOut: number): Promise<void> {
    // 超时判断
    if (Date.now() - startTime >= timeOut) {
        return
    }

    // 轮询间隔时间
    await new Promise((resolve) => setTimeout(resolve, pollingTime))

    // 构造请求参数
    const req: StreamsStatusRequest = {
        stream_items: streams,
    }

    // 发送请求
    const res = await getStreamIDsStatusAPI(req)

    // 处理响应
    const info = res.data
    if (info.code === ResponseCode.GetStreamIDStatusSuccess) {
        if (info.data.status_all === StreamStatus.UnHandle) {
            // 未处理，继续轮询
            await poll(streams, startTime, pollingTime, timeOut)
        }

        return
    }

    // 处理错误
    MessageUtil.error(handleResErr(res))
}

/**
 * 轮询获取stream状态
 * @param streams stream 列表
 * @param pollingTime 轮询间隔时间，默认1000ms
 * @param timeOut 超时时间，默认10000ms
 * @returns Promise<void>
 */
export async function pollingGetStreamIDsStatus(streams: StreamInfo[], pollingTime: number = 1000, timeOut: number = 10000): Promise<void> {
    const startTime = Date.now()
    await poll(streams, startTime, pollingTime, timeOut)
}
