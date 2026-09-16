/*
 * FilePath    : blog-client\src\api\notification\getShortCodes.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取短码
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface NotificationShortCodes {
    codes: string[]
}

export function getNotificationShortCodesAPI(): ResPromise<Res<NotificationShortCodes>> {
    const urlStr = routerGroup + "/notification/short-codes"
    return request({
        url: urlStr,
        method: "get",
    })
}
