/*
 * FilePath    : blog-client-nuxt\src\api\setting\setup.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 设置数据库
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface PgsqlSetupRequest {
    host: string // 数据库主机地址
    user: string // 数据库用户名
    password: string // 数据库密码
    database: string // 数据库名称
    table_prefix: string // 表前缀
    port: number // 数据库端口
}

export interface ESSetupRequest {
    addresses: string[] // 地址列表
    user: string // 用户名
    password: string // 密码
    index_prefix: string // 索引前缀
    ca_cert: string // CA 证书(可选)
    use_ca_cert: boolean // 是否使用 CA 认证(可选)
}

export interface RedisNodeSetupRequest {
    host: string // 主机
    port: number // 端口
    user: string // 用户名
    password: string // 密码
    database: number // 数据库 0-15
}

export interface SetupRequest {
    pgsql: PgsqlSetupRequest // pgsql 配置
    redis: RedisNodeSetupRequest[] // redis 配置
    es: ESSetupRequest // es 配置
}

// 提交站点初始化配置
export function setupAPI(requestData: SetupRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/setup"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
