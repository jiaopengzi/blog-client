/*
 * FilePath    : blog-client\src\api\billingCenter\getAccount.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 获取计费中心账号信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { BillingCenterAccountRes } from "./common"

// 获取计费中心账号信息
export function billingCenterGetAccountAPI(): ResPromise<Res<BillingCenterAccountRes>> {
    const urlStr = routerGroup + "/billing-center/account"
    return request({
        url: urlStr,
        method: "get",
    })
}
