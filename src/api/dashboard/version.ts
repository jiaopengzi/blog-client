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

// https://raw.githubusercontent.com/jiaopengzi/blog-server/refs/heads/main/CHANGELOG.md
// https://gitee.com/jiaopengzi/blog-server/raw/main/CHANGELOG.md

export enum Source {
    GitHub = "github",
    Gitee = "gitee",
}

export enum Project {
    Server = "blog-server",
    Client = "blog-client",
}

// 获取版本更新日志
export function getVersionsAPI(project: Project, source: Source): Promise<Response> {
    let group = "raw-github"
    let urlStr = `${group}/jiaopengzi/${project}/refs/heads/main/CHANGELOG.md`

    if (source === Source.Gitee) {
        group = "raw-gitee"
        urlStr = `${group}/jiaopengzi/${project}/raw/main/CHANGELOG.md`
    }

    return fetch(urlStr)
}
