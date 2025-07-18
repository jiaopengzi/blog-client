/*
 * FilePath    : blog-client\src\api\order\update_admin.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 管理员更新订单备注
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface UpdateOrderAdminRequest {
    id: string // 订单ID
    remark: string // 备注
    remark_admin: string // 管理员备注
}

// 更新订单响应
export type UpdateOrderAdminRes = StreamsStatusRes

// 更新订单备注
export function updateOrderAdminAPI(requestData: UpdateOrderAdminRequest): ResPromise<Res<UpdateOrderAdminRes>> {
    const urlStr = routerGroup + "/order/update-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
