/**
 * @FilePath     : \blog-client\src\api\setting\setup.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 设置数据库
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
    user_name: string // 用户名
    password: string // 密码
    index_prefix: string // 表前缀
}

export interface RedisNodeSetupRequest {
    host: string // 主机
    port: number // 端口
    user: string // 用户名
    password: string // 密码
    database: number // 数据库 0-15
}

export interface SetupRequest {
    pgsql: PgsqlSetupRequest // pgsql配置
    redis: RedisNodeSetupRequest[] // redis配置
    es: ESSetupRequest // es配置
}

// 检测验证码是否正确
export function setupAPI(requestData: SetupRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/setup"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
