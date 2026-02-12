/*
 * FilePath    : blog-client\src\api\billingCenter\rechargeQuery.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心充值查询
 */

import { PayType } from "@/api/pay/common"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { BillingCenterRechargeQueryRes } from "./common"

// 充值查询请求参数
export interface BillingCenterRechargeQueryRequest {
    pay_type: PayType // 支付类型
    order_id: string // 订单ID
}

// 充值查询
export function billingCenterRechargeQueryAPI(requestData: BillingCenterRechargeQueryRequest): ResPromise<Res<BillingCenterRechargeQueryRes>> {
    const urlStr = routerGroup + "/billing-center/recharge-query"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
