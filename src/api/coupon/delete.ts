/*
 * FilePath    : blog-client\src\api\coupon\delete.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 删除优惠券
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface DeleteCouponRequest {
    id_list: string[]
}

// 删除优惠券
export function deleteCouponAPI(requestData: DeleteCouponRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/coupon/delete"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
