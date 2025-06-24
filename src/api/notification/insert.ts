/*
 * FilePath    : blog-client\src\api\notification\insert.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 插入通知
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { InsertNotificationRequest, NotificationStatus } from "./common"

// 插入通知响应
export interface InsertNotificationResData extends StreamsStatusRes {
    id: string
    created_at: string
    updated_at: string
    status: NotificationStatus
}

// 插入通知
export function insertNotificationAPI(requestData: InsertNotificationRequest): ResPromise<Res<InsertNotificationResData>> {
    const urlStr = routerGroup + "/notification/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
