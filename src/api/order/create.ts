/*
 * FilePath    : blog-client\src\api\order\create.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 创建订单
 */

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { Currency, OrderStatus, ProductType } from "./common"

// 产品
export interface Product {
    product_type: ProductType // 产品类型
    related_id: string // 关联ID
    quantity: string // 数量
}

// 创建订单请求数据
export interface OrderCreateRequest {
    products: Product[] // 产品列表
    remark?: string // 订单备注
}

// 订单子表
export interface OrderItemCreate {
    order_id: string // 订单ID
    product_id: string // 产品ID
    product_type: ProductType // 产品类型
    title: string // 产品标题
    quantity: number // 数量
    price: number // 价格（分）
}

// 创建订单响应数据
export interface OrderCreateRes extends StreamsStatusRes {
    id: string
    created_at: string
    updated_at: string
    status: OrderStatus // 订单状态
    currency: Currency // 货币类型
    total_amount: number // 总金额（分）
    user_id: string // 用户ID
    order_items: OrderItemCreate[] // 订单子表
    description: string // 描述
}

// 创建订单
export function orderCreateAPI(requestData: OrderCreateRequest): ResPromise<Res<OrderCreateRes>> {
    const urlStr = routerGroup + "/order/create"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
