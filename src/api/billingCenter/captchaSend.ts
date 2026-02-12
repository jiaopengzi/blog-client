/*
 * FilePath    : blog-client\src\api\billingCenter\captchaSend.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心发送验证码
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { BillingCenterPurpose } from "./common"

// 发送验证码请求参数
export interface BillingCenterCaptchaSendRequest {
    purpose: BillingCenterPurpose // 验证码用途
}

// 发送验证码
export function billingCenterCaptchaSendAPI(requestData: BillingCenterCaptchaSendRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/billing-center/captcha-send"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
