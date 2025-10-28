/*
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : hooks
 */

import { ref } from "vue"

import { TimeDimension, TrendCategory } from "@/api/dashboard/common"
import { getStatsAPI, type StatsRes } from "@/api/dashboard/stats"
import { getTrendAPI, type TrendDimensionRequest, type TrendDimensionRes } from "@/api/dashboard/trend"
import { getVersionAPI, type VersionRes } from "@/api/dashboard/version"
import { ResponseCode } from "@/api/response"
import { getVersionInfo } from "@/version"

export function useDashboard() {
    const versionClient = getVersionInfo()

    // 服务端版本信息
    const versionServer = ref<VersionRes>({
        version: "",
        build_time: "",
        commit: "",
    })

    // 面板统计数据
    const stats = ref<StatsRes>({
        post_count: 0,
        comment_count: 0,
        comment_count_pending: 0,
        order_count: 0,
        order_total_amount: 0,
        order_paid_total_amount: 0,
        user_count: 0,
    })

    // 趋势统计请求参数
    const trendReq = ref<TrendDimensionRequest>({
        category: TrendCategory.OrderCount,
        dimension: TimeDimension.Day,
        is_current: true,
    })

    // 趋势数据
    const trendData = ref<TrendDimensionRes>({
        dimension: TimeDimension.Day,
        rows: [],
    })

    // 获取版本信息
    const getVersion = async () => {
        const res = await getVersionAPI()
        if (res.data.code === ResponseCode.DashboardGetVersionSuccess) {
            versionServer.value = res.data.data
        }
    }

    // 获取面板统计数据
    const getStats = async () => {
        const res = await getStatsAPI()
        if (res.data.code === ResponseCode.DashboardGetStatsSuccess) {
            stats.value = res.data.data
        }
    }

    // 金额类统计类别列表
    const amountList = [TrendCategory.OrderAmount, TrendCategory.OrderPaidAmount]

    // 获取面板按维度统计数据
    const getTrend = async () => {
        const res = await getTrendAPI(trendReq.value)
        if (res.data.code === ResponseCode.DashboardGetTrendSuccess) {
            // 如果是金额类数据, 则将分转换为元
            if (amountList.includes(trendReq.value.category)) {
                res.data.data.rows = res.data.data.rows.map((item) => ({
                    ...item,
                    value: item.value / 100,
                }))
            }
            trendData.value = res.data.data
        }
    }

    // 更新趋势请求参数
    const updateTrendReq = (
        category: TrendCategory, // 统计类别
        dimension: TimeDimension, // 时间维度
        is_current: boolean, // 是否为当期
    ) => {
        trendReq.value = {
            category,
            dimension,
            is_current,
        }
    }

    return {
        versionClient,
        versionServer,
        stats,
        trendReq,
        trendData,
        getVersion,
        getStats,
        getTrend,
        updateTrendReq,
    }
}
