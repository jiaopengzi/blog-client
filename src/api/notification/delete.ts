/*
 * FilePath    : blog-client\src\api\notification\delete.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 删除通知
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteNotificationRequest {
    id_list: string[]
}

// 删除通知
export function deleteNotificationAPI(requestData: DeleteNotificationRequest): ResPromise<Res<StreamsStatusRes>> {
    const urlStr = routerGroup + "/notification/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
