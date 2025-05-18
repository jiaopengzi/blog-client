/*
 * FilePath    : blog-client\src\utils\getStreamIDStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取streamID状态
 */

import { getStreamIDStatusAPI, StreamIdStatus, type StreamIdStatusRequest } from "@/api/helper/getStreamIDStatus"
import { handleResErr, ResponseCode } from "@/api/response"
import { MessageUtil } from "@/utils/message"

/**
 * 递归轮询获取streamID状态(内部使用)
 * @param streamId streamID
 * @param startTime 开始时间
 * @param pollingTime 轮询间隔时间
 * @param timeOut 超时时间
 * @returns Promise<void>
 */
async function poll(streamId: string, startTime: number, pollingTime: number, timeOut: number): Promise<void> {
    // 超时判断
    if (Date.now() - startTime >= timeOut) {
        return
    }

    // 轮询间隔时间
    await new Promise((resolve) => setTimeout(resolve, pollingTime))

    // 构造请求参数
    const req: StreamIdStatusRequest = {
        stream_id: streamId,
    }

    // 发送请求
    const res = await getStreamIDStatusAPI(req)

    // 处理响应
    const info = res.data
    if (info.code === ResponseCode.GetStreamIDStatusSuccess) {
        if (info.data.status === StreamIdStatus.UnHandle) {
            // 未处理，继续轮询
            await poll(streamId, startTime, pollingTime, timeOut)
            return
        } else {
            return
        }
    }

    // 处理错误
    MessageUtil.error(handleResErr(res))
}

/**
 * 轮询获取streamID状态
 * @param streamId streamID
 * @param pollingTime 轮询间隔时间，默认1000ms
 * @param timeOut 超时时间，默认10000ms
 * @returns Promise<void>
 */
export async function pollingGetStreamIDStatus(streamId: string, pollingTime: number = 1000, timeOut: number = 10000): Promise<void> {
    const startTime = Date.now()
    await poll(streamId, startTime, pollingTime, timeOut)
}
