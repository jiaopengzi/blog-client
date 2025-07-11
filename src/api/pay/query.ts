/*
 * FilePath    : blog-client\src\api\pay\query.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查询订单支付状态
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { PayType, TradeState } from "./common"

// 查询订单支付请求数据
export interface PayQueryRequest {
    pay_type: PayType // 支付类型
    order_id: string // 订单ID
}

// 查询订单支付响应数据
export interface PayQueryResData {
    order_id: string // 订单ID
    pay_status: TradeState // 支付状态
}

// 查询订单支付状态
export function payQueryAPI(requestData: PayQueryRequest): ResPromise<Res<PayQueryResData>> {
    const urlStr = routerGroup + "/pay/query"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
