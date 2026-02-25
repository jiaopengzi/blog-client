/**
 * FilePath    : blog-client-dev\src\api\billingCenter\getLicense.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 获取计费中心授权信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { BillingCenterLicenseRes } from "./common"

// 获取计费中心授权信息
export function billingCenterGetLicenseAPI(): ResPromise<Res<BillingCenterLicenseRes>> {
    const urlStr = routerGroup + "/billing-center/license"
    return request({
        url: urlStr,
        method: "get",
    })
}
