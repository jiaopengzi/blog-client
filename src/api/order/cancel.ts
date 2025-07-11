/*
 * FilePath    : blog-client\src\api\order\cancel.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 取消订单
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 取消订单请求参数
export interface OrderCancelRequest {
    id: string // 订单ID
}

// 取消订单
export function orderCancelAPI(requestData: OrderCancelRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/order/cancel"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
