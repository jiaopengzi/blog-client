/*
 * FilePath    : blog-client\src\api\notification\sendTest.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 发送测试通知
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface NotificationSendTestRequest {
    id: string // ID
}

// 发送测试通知
export function notificationSendTestAPI(requestData: NotificationSendTestRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/notification/send-test"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
