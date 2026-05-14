/*
 * FilePath    : blog-client\src\api\dashboard\version.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 面板版本相关 API
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 后端版本信息响应类型
export interface VersionRes {
    version: string // 版本号
    build_time: string // 构建时间
    commit: string // 提交哈希
}

export enum RemoteVersionSource {
    GitHub = "github",
    Gitee = "gitee",
}

export interface RemoteVersionItem {
    version: string // 远端版本号
    date: string // 发布日期
    source: RemoteVersionSource // 实际命中的远端源
}

export interface RemoteVersionOverviewRes {
    preferred_source: RemoteVersionSource | "" // 兼容保留字段, 竞速模式下为空字符串
    server: RemoteVersionItem | null // 服务端远端版本
    client: RemoteVersionItem | null // 客户端远端版本
}

// 获取后端版本信息
export function getVersionAPI(): ResPromise<Res<VersionRes>> {
    const urlStr = routerGroup + "/dashboard/version"
    return request({
        url: urlStr,
        method: "get",
    })
}

/**
 * getRemoteVersionOverviewAPI 获取管理台远端最新版本信息.
 * 由后端执行双源竞速并做一小时缓存, 谁先成功返回就使用谁.
 */
export function getRemoteVersionOverviewAPI(): ResPromise<Res<RemoteVersionOverviewRes>> {
    const urlStr = routerGroup + "/dashboard/version-remote"
    return request({
        url: urlStr,
        method: "get",
    })
}
