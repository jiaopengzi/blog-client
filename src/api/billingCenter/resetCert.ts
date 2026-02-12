/*
 * FilePath    : blog-client\src\api\billingCenter\resetCert.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 计费中心重置证书
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { BillingCenterResetCertRes } from "./common"

// 重置证书请求参数
export interface BillingCenterResetCertRequest {
    captcha: string // 验证码
    domain_name?: string // 域名, 可选
}

// 重置证书
export function billingCenterResetCertAPI(requestData: BillingCenterResetCertRequest): ResPromise<Res<BillingCenterResetCertRes>> {
    const urlStr = routerGroup + "/billing-center/reset-cert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
