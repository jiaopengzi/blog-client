/*
 * FilePath    : blog-client-nuxt\src\utils\ipPlatform.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取公网IP地址
 */

import { request } from "@/api/request"

export async function getPublicIp(): Promise<string> {
    try {
        // 阶段 1 适配: request 为配置对象风格(axios 风格 request.get 不再支持)
        const response = await request<{ ip: string }>({ url: "https://api.ipify.org?format=json", method: "get" })
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

// 判断是否为移动端
export function isMobile(userAgent: string) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}
