/*
 * FilePath    : blog-client\src\api\coupon\getCountByStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 按照优惠券状态统计优惠券数量
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { CouponStatus } from "./common"

export interface CouponCountByStatus {
    status: CouponStatus // 状态
    count: number // 数量
}

export function getCouponCountByStatusAPI(): ResPromise<Res<CouponCountByStatus[]>> {
    const urlStr = routerGroup + "/coupon/count-by-status"
    return request({
        url: urlStr,
        method: "get",
    })
}
