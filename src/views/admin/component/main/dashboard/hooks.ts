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
import { getRemoteVersionOverviewAPI, getVersionAPI, type RemoteVersionItem, type RemoteVersionOverviewRes, type VersionRes } from "@/api/dashboard/version"
import { ResponseCode } from "@/api/response"
import { getVersionInfo } from "@/version"

import { buildDashboardVersionUpdateState } from "./version-update"

/**
 * useDashboard 管理台面板组合式函数.
 * 统一封装版本、统计和趋势相关状态, 避免组件层直接拼装接口和转换逻辑.
 */
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
        order_paid_count: 0,
        order_paid_total_amount: 0,
        user_count: 0,
        membership_count: 0,
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

    const hasUpdateServer = ref<boolean>(false)
    const hasUpdateClient = ref<boolean>(false)
    const updateVersionServer = ref<RemoteVersionItem | null>(null)
    const updateVersionClient = ref<RemoteVersionItem | null>(null)
    const remoteVersionOverview = ref<RemoteVersionOverviewRes | null>(null)
    const remoteVersionLoading = ref<boolean>(false)
    const remoteVersionError = ref<string>("")

    const applyRemoteVersionUpdateState = (overview: RemoteVersionOverviewRes | null = remoteVersionOverview.value) => {
        const versionUpdateState = buildDashboardVersionUpdateState(overview, versionServer.value.version, versionClient.version)
        hasUpdateServer.value = versionUpdateState.hasUpdateServer
        hasUpdateClient.value = versionUpdateState.hasUpdateClient
        updateVersionServer.value = versionUpdateState.updateVersionServer
        updateVersionClient.value = versionUpdateState.updateVersionClient
    }

    // 获取版本信息
    const getVersion = async () => {
        const res = await getVersionAPI()
        if (res.data.code === ResponseCode.DashboardGetVersionSuccess) {
            versionServer.value = res.data.data
            applyRemoteVersionUpdateState()
        }
    }

    /**
     * fetchChangelog 获取远端最新版本概览.
     * 实际远端访问已下沉到后端, 前端只消费后端聚合结果并计算是否存在更新.
     */
    const fetchChangelog = async () => {
        remoteVersionLoading.value = true
        remoteVersionError.value = ""

        try {
            const res = await getRemoteVersionOverviewAPI()
            if (res.data.code !== ResponseCode.DashboardGetRemoteVersionSuccess) {
                remoteVersionOverview.value = null
                applyRemoteVersionUpdateState(null)
                remoteVersionError.value = "远端版本信息暂不可用"
                return
            }

            remoteVersionOverview.value = res.data.data
            applyRemoteVersionUpdateState(res.data.data)
        } catch (error) {
            remoteVersionOverview.value = null
            applyRemoteVersionUpdateState(null)
            remoteVersionError.value = "远端版本信息暂不可用"
            console.error("Failed to fetch changelog:", error)
        } finally {
            remoteVersionLoading.value = false
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
    const amountList = new Set<TrendCategory>([TrendCategory.OrderAmount, TrendCategory.OrderPaidAmount])

    // 获取面板按维度统计数据
    const getTrend = async () => {
        const res = await getTrendAPI(trendReq.value)
        if (res.data.code === ResponseCode.DashboardGetTrendSuccess) {
            // 如果是金额类数据, 则将分转换为元
            if (amountList.has(trendReq.value.category)) {
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
        hasUpdateServer,
        hasUpdateClient,
        updateVersionServer,
        updateVersionClient,
        remoteVersionLoading,
        remoteVersionError,
        fetchChangelog,
        getStats,
        getTrend,
        updateTrendReq,
    }
}
