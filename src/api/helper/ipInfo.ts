/*
 * FilePath    : blog-client\src\api\helper\getStreamIDStatus.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取streamID状态
 */

import axios from "axios"

import type { ResPromise } from "@/api/response"

//1. 创建axios对象
const request = axios.create()

export interface IpInfoRes {
    status: string
    country: string
    countryCode: string
    region: string
    regionName: string
    city: string
    zip: string
    lat: number
    lon: number
    timezone: string
    isp: string
    org: string
    as: string
    query: string
}

// http://ip-api.com/json/?lang=zh-CN
export function getIpInfoAPI(): ResPromise<IpInfoRes> {
    const urlStr = "http://ip-api.com/json/?lang=zh-CN"
    return request({
        url: urlStr,
        method: "get",
    })
}
