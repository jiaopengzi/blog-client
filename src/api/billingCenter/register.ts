/*
 * FilePath    : blog-client\src\api\billingCenter\register.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心注册
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { BillingCenterRegisterRes } from "./common"

// 注册请求参数
export interface BillingCenterRegisterRequest {
    captcha: string // 验证码
    domain_name?: string // 域名, 可选
}

// 注册计费中心
export function billingCenterRegisterAPI(requestData: BillingCenterRegisterRequest): ResPromise<Res<BillingCenterRegisterRes>> {
    const urlStr = routerGroup + "/billing-center/register"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
