/*
 * FilePath    : blog-client\src\api\notification\batchOperationStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 批量操作通知状态
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { NotificationStatus } from "./common"

export interface NotificationStatusOperation {
    id: string // ID
    status: NotificationStatus // 状态
}

export interface BatchOperationNotificationStatusRequest {
    operation_list: NotificationStatusOperation[] // 操作列表
}

// 批量操作通知状态
export function batchOperationNotificationStatusAPI(requestData: BatchOperationNotificationStatusRequest): ResPromise<Res<StreamsStatusRes>> {
    const urlStr = routerGroup + "/notification/batch-operation-status"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
