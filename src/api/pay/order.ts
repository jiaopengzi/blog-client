/*
 * FilePath    : blog-client\src\api\pay\order.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 支付订单
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { PayType } from "./common"

// 支付订单请求数据
export interface PayOrderRequest {
    is_re_pay?: boolean // 是否重新支付, 首次支付时为false, 重新支付时为true
    pay_type: PayType // 支付类型
    order_id: string // 订单ID
    description: string // 支付订单描述
    amount: number // 支付金额（单位：分）
    return_url: string // 支付完成后的回调地址
}

// 支付订单响应数据
export interface PayOrderResData {
    order_id: string // 订单ID
    pay_type: PayType // 支付类型
    pay_url: string // 支付二维码链接
}

// 支付订单
export function payOrderAPI(requestData: PayOrderRequest): ResPromise<Res<PayOrderResData>> {
    const urlStr = routerGroup + "/pay/order"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
