/*
 * FilePath    : blog-client\src\api\captcha\checkRefund.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 退款验证码校验接口
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CaptchaCheckRefundRequest {
    order_id: string
}

// 检测退款验证码是否正确
export function captchaCheckRefundAPI(requestData: CaptchaCheckRefundRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/captcha/check-refund"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
