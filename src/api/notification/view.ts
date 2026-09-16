/*
 * FilePath    : blog-client\src\api\notification\view.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看通知
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { NotificationRes, NotificationStatus } from "./common"

// 查看通知请求参数
export interface ViewNotificationRequest extends PaginationRequest {
    status?: NotificationStatus // 状态
}

// 查看通知
export function viewNotificationAPI(requestData: ViewNotificationRequest): ResPromise<Res<Pagination<NotificationRes>>> {
    const urlStr = routerGroup + "/notification/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
