/*
 * FilePath    : blog-client\src\api\coupon\view.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看优惠券
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { CouponRes, CouponStatus } from "./common"

// 查看优惠券请求参数
export interface ViewCouponRequest extends PaginationRequest {
    status?: CouponStatus // 状态
}

// 查看优惠券
export function viewCouponAPI(requestData: ViewCouponRequest): ResPromise<Res<Pagination<CouponRes>>> {
    const urlStr = routerGroup + "/coupon/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
