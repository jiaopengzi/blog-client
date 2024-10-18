/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-28 16:21:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 08:58:54
 * @FilePath     : \blog-client\src\api\loginLog\getLoginLogs.ts
 * @Description  : 获取日志
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import type { DataWithImg, Pagination } from "@/components/common"
import { ResponseCode } from "@/api/responseCode"
import { convertToBeijingTime } from "@/utils/dateTime"
import { parsePlatform } from "@/utils/ipPlatform"

export interface GetLoginLogsRequest {
    current_page: number // 当前页
    page_size: number // 每页显示条数
    key_word?: string // 关键字
}

// 获取日志信息响应类型
export interface GetLoginLogsResponse {
    code: number
    msg: string
    data: Pagination<LoginLog> // 日志信息
}

// 获取用户信息 api 函数
export async function getLoginLogsAPI(
    requestData: GetLoginLogsRequest = { current_page: 1, page_size: 10 }, // 设置默认值,
): AxiosPromise<GetLoginLogsResponse> {
    const urlStr = routerGroup + "/login-log/view"
    const response = await request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
    // 在这里使用 map 函数来格式化每行信息
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
    user_id: string // 用户id
    user_name: string // 用户名
    ip_address: string // ip地址
    ip_country: string // 国家
    ip_region_name: string // 地区
    ip_city: string // 城市
    platform: string // 平台
    login_type: string // 登录方式
}

// 格式化日志信息
export function formatUserLoginLog({ platform, created_at, ...loginLog }: any): LoginLog {
    const formattedLoginLog: LoginLog = {
        ...loginLog,
        created_at: convertToBeijingTime(created_at), // 使用 convertToBeijingTime 进行格式化
    }

    // 如果 user_avatar 不为空，添加 img 属性
    if (platform) {
        formattedLoginLog.platform = parsePlatform(platform)
    }

    return formattedLoginLog
}

// 默认的 UserInfo 空对象
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
