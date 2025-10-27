/*
 * FilePath    : blog-client\src\api\dashboard\stats.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取面板统计数据
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 获取面板统计数据响应类型
export interface StatsRes {
    post_count: number // 文章数量
    comment_count: number // 评论数量
    comment_count_pending: number // 待审核评论数量
    order_count: number // 订单数量
    order_total_amount: number // 订单总金额(分)
    order_paid_total_amount: number // 订单总支付金额(分)
    user_count: number // 用户数量
}

// 获取面板统计数据
export function getStatsAPI(): ResPromise<Res<StatsRes>> {
    const urlStr = routerGroup + "/dashboard/stats"
    return request({
        url: urlStr,
        method: "get",
    })
}
