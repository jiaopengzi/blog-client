/*
 * FilePath    : blog-client\src\api\notification\getCountByStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 按照通知状态统计通知数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { NotificationStatus } from "./common"

export interface NotificationCountByStatus {
    status: NotificationStatus // 状态
    count: number // 数量
}

export function getNotificationCountByStatusAPI(): ResPromise<Res<NotificationCountByStatus[]>> {
    const urlStr = routerGroup + "/notification/count-by-status"
    return request({
        url: urlStr,
        method: "get",
    })
}
