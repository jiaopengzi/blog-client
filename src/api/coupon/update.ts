/*
 * FilePath    : blog-client\src\api\coupon\update.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新优惠卷
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { UpdateCouponRequest } from "./common"

// 更新优惠卷
export function updateCouponAPI(requestData: UpdateCouponRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/coupon/update"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
