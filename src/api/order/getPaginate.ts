/*
 * FilePath    : blog-client\src\api\order\getPaginate.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取订单分页数据
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"

import type { OrderGetByIDRes, OrderStatus } from "./common"

// 获取订单分页数据请求参数
export interface OrderPaginationRequest extends PaginationRequest {
    status?: OrderStatus // 状态
    user_id?: string // 用户ID
}

// 获取订单分页数据响应
export function getPaginateAPI(requestData: OrderPaginationRequest): ResPromise<Res<Pagination<OrderGetByIDRes>>> {
    const urlStr = routerGroup + "/order/get-paginate"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 获取订单分页数据响应(管理员)
export function getPaginateAdminAPI(requestData: OrderPaginationRequest): ResPromise<Res<Pagination<OrderGetByIDRes>>> {
    const urlStr = routerGroup + "/order/get-paginate-admin"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
