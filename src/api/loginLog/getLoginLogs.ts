/*
 * FilePath    : blog-client-nuxt\src\api\loginLog\getLoginLogs.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取登录日志
 */

import { request, routerGroup } from "@/api/request"
import { type Pagination, type Res, ResponseCode, type ResPromise } from "@/api/response"
import type { DataWithImg } from "@/components/common"
import { formatTime } from "@/utils/dateTime"
import { parsePlatform } from "@/utils/ipPlatform"

export interface GetLoginLogsRequest {
    current_page: number // 当前页
    page_size: number // 每页显示条数
    key_word?: string // 关键字
}

// 获取登录日志 api 函数
export async function getLoginLogsAPI(requestData: GetLoginLogsRequest = { current_page: 1, page_size: 10 }): ResPromise<Res<Pagination<LoginLog>>> {
    const urlStr = routerGroup + "/login-log/view"
    const response = await request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
    // 使用 map 格式化每行记录
    if (response.data.code === ResponseCode.GetLoginLogsSuccess) {
        response.data.data.records = response.data.data.records.map(formatUserLoginLog)
        return response
    }
    return response
}

// 每行信息
export interface LoginLog extends DataWithImg {
    id: string // id
    created_at: string // 创建时间
    user_id: string // 用户 id
    user_name: string // 用户名
    ip_address: string // ip 地址
    platform: string // 平台
    login_type: string // 登录方式
}

// 格式化日志信息
export function formatUserLoginLog({ platform, created_at, ...loginLog }: LoginLog): LoginLog {
    const formattedLoginLog: LoginLog = {
        ...loginLog,
        created_at: formatTime(created_at),
        platform: platform || "",
    }

    // 如果 platform 不为空, 解析平台信息
    if (platform) {
        formattedLoginLog.platform = parsePlatform(platform)
    }

    return formattedLoginLog
}

// 默认的登录日志空分页对象
export function emptyLoginLogs(): Pagination<LoginLog> {
    return {
        total: 0,
        current_page: 1,
        page_size: 10,
        page_count: 1,
        page_sizes: [10],
        records: [],
    }
}
