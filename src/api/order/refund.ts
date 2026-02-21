/*
 * FilePath    : blog-client\src\api\order\refund.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 退款
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 订单退款请求参数
export interface OrderRefundRequest {
    id: string // 订单ID
    refund_amount: string // 退款金额，单位为分
    reason: string // 退款原因
    captcha: string // 验证码
}

// 订单退款响应
export type OrderRefundRes = StreamsStatusRes

// 订单退款
export function orderRefundAPI(requestData: OrderRefundRequest): ResPromise<Res<OrderRefundRes>> {
    const urlStr = routerGroup + "/order/refund"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
