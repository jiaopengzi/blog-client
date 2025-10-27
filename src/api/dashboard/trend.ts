/*
 * FilePath    : blog-client\src\api\dashboard\trend.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取面板按维度统计数据
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { type Row, TimeDimension, TrendCategory } from "./common"

// 获取面板按维度统计数据请求类型
export interface TrendDimensionRequest {
    category: TrendCategory // 统计类别
    dimension: TimeDimension // 时间维度
    is_current?: boolean // 是否为当期
}

// 获取面板按维度统计数据响应类型
export interface TrendDimensionRes {
    dimension: TimeDimension // 维度值
    rows: Row[] // 统计的行
}

// 获取面板按维度统计数据
export function getTrendAPI(requestData: TrendDimensionRequest): ResPromise<Res<TrendDimensionRes>> {
    const urlStr = routerGroup + "/dashboard/trend"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
