/*
 * FilePath    : blog-client\src\api\order\getCheckout.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取订单结算信息
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import type { PayOrderRes } from "@/api/pay/order"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { Currency, OrderStatus } from "./common"
import type { OrderCouponApplyRes } from "./couponApply"
import type { OrderCreateRes } from "./create"

// OrderCheckoutRes 结算响应模型
export interface OrderCheckoutRes extends StreamsStatusRes {
    order: OrderCreateRes
    coupon: OrderCouponApplyRes | null // 优惠券应用信息
    payment: PayOrderRes | null // 支付信息
}

// 获取订单结算信息
export function getOrderCheckoutAPI(): ResPromise<Res<OrderCheckoutRes>> {
    const urlStr = routerGroup + "/order/checkout"
    return request({
        url: urlStr,
        method: "get",
    })
}

// 按照订单id获取订单详情请求参数
export interface GetCheckoutByOrderIdRequest {
    id: string // 订单ID
}

// 获取订单结算信息
export function getOrderCheckoutByOrderIdAPI(req: GetCheckoutByOrderIdRequest): ResPromise<Res<OrderCheckoutRes>> {
    const urlStr = routerGroup + "/order/checkout-by-order-id"
    return request({
        url: urlStr,
        method: "post",
        data: req,
    })
}

// 生成空的结算响应数据
export function generateEmptyResponse(): OrderCheckoutRes {
    return {
        order: {
            id: "",
            created_at: "",
            updated_at: "",
            status: OrderStatus.PendingPay,
            currency: Currency.CNY,
            total_amount: 0,
            user_id: "",
            order_items: [],
            description: "",
            return_url: "",
            stream_items: [],
        },
        coupon: null,
        payment: null,
        stream_items: [],
    }
}
