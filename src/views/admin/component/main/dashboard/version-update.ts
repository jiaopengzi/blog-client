/**
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\version-update.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 面板版本更新状态工具
 */

import type { RemoteVersionItem, RemoteVersionOverviewRes } from "@/api/dashboard/version"

export interface DashboardVersionUpdateState {
    hasUpdateServer: boolean
    hasUpdateClient: boolean
    updateVersionServer: RemoteVersionItem | null
    updateVersionClient: RemoteVersionItem | null
}

/**
 * buildDashboardVersionUpdateState 根据远端版本概览和当前版本生成更新状态.
 * 统一处理服务端和客户端的版本比较, 避免在 hooks 中散落重复判断逻辑.
 */
export function buildDashboardVersionUpdateState(
    remoteOverview: RemoteVersionOverviewRes | null | undefined,
    currentServerVersion: string,
    currentClientVersion: string,
): DashboardVersionUpdateState {
    const updateVersionServer = remoteOverview?.server ?? null
    const updateVersionClient = remoteOverview?.client ?? null

    return {
        hasUpdateServer: updateVersionServer !== null && currentServerVersion !== "" && updateVersionServer.version !== currentServerVersion,
        hasUpdateClient: updateVersionClient !== null && updateVersionClient.version !== currentClientVersion,
        updateVersionServer,
        updateVersionClient,
    }
}
