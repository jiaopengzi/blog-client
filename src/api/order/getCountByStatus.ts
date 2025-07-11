/*
 * FilePath    : blog-client\src\api\order\getCountByStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 按照订单状态统计订单数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { OrderStatus } from "./common"

export interface OrderCountByStatus {
    status: OrderStatus // 状态
    count: number // 数量
}

export function getOrderCountByStatusAPI(): ResPromise<Res<OrderCountByStatus[]>> {
    const urlStr = routerGroup + "/order/count-by-status"
    return request({
        url: urlStr,
        method: "get",
    })
}
