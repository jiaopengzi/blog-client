/*
 * FilePath    : blog-client\src\api\coupon\checkCouponCode.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 优惠券码查重
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckCouponCodeRequest {
    code: string
}

// 检查优惠券码是否存在
export function checkCouponCodeAPI(requestData: CheckCouponCodeRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/coupon/check-code"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
