/*
 * FilePath    : blog-client\src\api\notification\update.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新通知
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { UpdateNotificationRequest } from "./common"

// 更新通知
export function updateNotificationAPI(requestData: UpdateNotificationRequest): ResPromise<Res<StreamsStatusRes>> {
    const urlStr = routerGroup + "/notification/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
