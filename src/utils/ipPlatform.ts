/**
 * @FilePath     : \blog-client\src\utils\ipPlatform.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取公网IP地址
 */

import { request } from "@/api/request"

export async function getPublicIp(): Promise<string> {
    try {
        const response = await request.get("https://api.ipify.org?format=json")
        return response.data.ip
    } catch (error) {
        console.error("获取公网IP地址失败:", error)
        return "127.0.0.1"
    }
}

// 解析用户平台信息
export function parsePlatform(userAgent: string) {
    let platform = "unknown"

    if (userAgent.indexOf("Win64") !== -1 || userAgent.indexOf("Windows NT") !== -1) {
        platform = "Windows"
    } else if (userAgent.indexOf("Macintosh") !== -1) {
        platform = "MacOS"
    } else if (userAgent.indexOf("Linux") !== -1) {
        platform = "Linux"
    } else if (userAgent.indexOf("iPhone") !== -1) {
        platform = "iOS"
    } else if (userAgent.indexOf("Android") !== -1) {
        platform = "Android"
    }

    return platform
}

// isMobile
export function isMobile(userAgent: string) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}
