/*
 * FilePath    : blog-client\src\api\captcha\sendRefund.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 退款验证码发送
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CaptchaSendRefundRequest {
    order_id: string
}

// 验证码发送响应
export type CaptchaSendRefundRes = StreamsStatusRes

// 验证码发送接口
export function captchaSendRefundAPI(requestData: CaptchaSendRefundRequest): ResPromise<Res<CaptchaSendRefundRes>> {
    const urlStr = routerGroup + "/captcha/send-refund"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
