/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 21:31:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-28 17:29:21
 * @FilePath     : \blog-client\src\utils\ip.ts
 * @Description  : 获取公网IP地址
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import axios from "axios"

export async function getPublicIp(): Promise<string> {
    try {
        const response = await axios.get("https://api.ipify.org?format=json")
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
