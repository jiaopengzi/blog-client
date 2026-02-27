/**
 * FilePath    : blog-client-dev\src\api\billingCenter\getAgreement.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 获取计费中心协议信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { BillingCenterAgreementRes } from "./common"

// 获取计费中心协议信息
export function billingCenterGetAgreementAPI(): ResPromise<Res<BillingCenterAgreementRes>> {
    const urlStr = routerGroup + "/billing-center/agreement"
    return request({
        url: urlStr,
        method: "get",
    })
}
