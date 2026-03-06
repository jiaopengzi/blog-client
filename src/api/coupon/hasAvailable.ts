/*
 * FilePath    : blog-client\src\api\coupon\hasAvailable.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 是否有可用的优惠券
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export function getCouponHasAvailableAPI(): ResPromise<Res<boolean>> {
    const urlStr = routerGroup + "/coupon/has-available"
    return request({
        url: urlStr,
        method: "get",
    })
}
