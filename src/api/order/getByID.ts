/*
 * FilePath    : blog-client\src\api\order\getByID.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看订单详情
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { OrderGetByIDRes } from "./common"

// 按照订单id获取订单详情请求参数
export interface OrderGetByIDRequest {
    id: string // 订单ID
}

// 按照订单id获取订单详情响应
export function getByIDAPI(requestData: OrderGetByIDRequest): ResPromise<Res<OrderGetByIDRes>> {
    const urlStr = routerGroup + "/order/get-by-id"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 按照订单id获取订单详情响应(管理员)
export function getByIDAdminAPI(requestData: OrderGetByIDRequest): ResPromise<Res<OrderGetByIDRes>> {
    const urlStr = routerGroup + "/order/get-by-id-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
