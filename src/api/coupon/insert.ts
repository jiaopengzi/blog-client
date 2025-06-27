/*
 * FilePath    : blog-client\src\api\coupon\insert.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description :
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { CouponStatus, InsertCouponRequest } from "./common"

// 插入响应
export interface InsertCouponResData {
    id: string
    created_at: string
    updated_at: string
    status: CouponStatus
}

// 插入
export function insertCouponAPI(requestData: InsertCouponRequest): ResPromise<Res<InsertCouponResData>> {
    const urlStr = routerGroup + "/coupon/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
