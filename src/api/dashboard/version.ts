/*
 * FilePath    : blog-client\src\api\dashboard\version.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 后端版本信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 后端版本信息响应类型
export interface VersionRes {
    version: string // 版本号
    build_time: string // 构建时间
    commit: string // 提交哈希
}

// 获取后端版本信息
export function getVersionAPI(): ResPromise<Res<VersionRes>> {
    const urlStr = routerGroup + "/dashboard/version"
    return request({
        url: urlStr,
        method: "get",
    })
}
