/*
 * FilePath    : blog-client\src\api\order\update.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新订单备注
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface UpdateOrderRequest {
    id: string //
    Remark: string // 备注
    RemarkAdmin: string // 管理员备注
}

// 更新订单响应
export type UpdateOrderRes = StreamsStatusRes

// 更新订单备注
export function updateOrderAPI(requestData: UpdateOrderRequest): ResPromise<Res<UpdateOrderRes>> {
    const urlStr = routerGroup + "/order/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
