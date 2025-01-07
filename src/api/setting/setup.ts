/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-07 16:52:53
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-07 16:59:20
 * @FilePath     : \blog-client\src\api\setting\setup.ts
 * @Description  : 设置数据库
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface RedisNodeSetupRequest {
    host: string // 主机
    port: number // 端口
    user_name: string // 用户名
    password: string // 密码
    db: number // 数据库 0-15
}

export interface PgsqlSetupRequest {
    host: string // 数据库主机地址
    user: string // 数据库用户名
    password: string // 数据库密码
    database: string // 数据库名称
    table_prefix: string // 表前缀
    port: number // 数据库端口
}

export interface setupRequest {
    pgsql: PgsqlSetupRequest // pgsql配置
    redis: RedisNodeSetupRequest[] // redis配置
}

// 检测验证码是否正确
export function setupAPI(requestData: setupRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/setup"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
