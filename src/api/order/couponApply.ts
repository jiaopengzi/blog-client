/*
 * FilePath    : blog-client\src\api\order\couponApply.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 优惠券应用
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 优惠券应用请求参数
export interface OrderCouponApplyRequest {
    id: string // 订单ID
    coupon_codes: string[] // 优惠券码列表
}

// OrderCouponApply 优惠券应用响应模型
export interface OrderCouponApplyRes extends StreamsStatusRes {
    order_id: string // 订单ID
    coupon_codes: string[] // 优惠券码列表
    total_amount: number // 总金额(分)
    discount_amount: number // 优惠金额(分)
    final_amount: number // 优惠后的总金额(分)
}

// 优惠券应用
export function orderCouponApplyAPI(requestData: OrderCouponApplyRequest): ResPromise<Res<OrderCouponApplyRes>> {
    const urlStr = routerGroup + "/order/coupon-apply"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
