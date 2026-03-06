/*
 * FilePath    : blog-client\src\api\coupon\checkCouponCodeExcludingID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 检查优惠券码是否存在，排除指定ID
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckCouponCodeExcludingIDRequest {
    excluding_id: string // 需要排除的id
    code: string
}

// 检查优惠券码是否存在，排除指定ID
export function checkCouponCodeExcludingIDAPI(requestData: CheckCouponCodeExcludingIDRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/coupon/check-code-excluding-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
