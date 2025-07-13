/*
 * FilePath    : blog-client\src\api\order\getCheckout.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取订单结算信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { OrderCouponApplyRes } from "./couponApply"
import type { OrderCreateRes } from "./create"

// OrderCheckoutRes 结算响应模型
export interface OrderCheckoutRes {
    order: OrderCreateRes
    coupon: OrderCouponApplyRes | null // 优惠券应用信息
}

export function getOrderCheckoutAPI(): ResPromise<Res<OrderCheckoutRes>> {
    const urlStr = routerGroup + "/order/checkout"
    return request({
        url: urlStr,
        method: "get",
    })
}
