/*
 * FilePath    : blog-client\src\api\billingCenter\recharge.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心充值
 */

import { PayType } from "@/api/pay/common"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { BillingCenterRechargeRes } from "./common"

// 充值请求参数
export interface BillingCenterRechargeRequest {
    pay_type: PayType // 支付类型
    total_amount: string // 充值金额(分)
    remark?: string // 备注, 可选, 最大 1000 字符
    return_url?: string // 支付回调 URL, 可选
}

// 充值下单
export function billingCenterRechargeAPI(requestData: BillingCenterRechargeRequest): ResPromise<Res<BillingCenterRechargeRes>> {
    const urlStr = routerGroup + "/billing-center/recharge"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
