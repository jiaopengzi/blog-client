/*
 * FilePath    : blog-client-nuxt\src\api\helper\ipInfo.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 获取公网 IP 信息(阶段 1 重写: axios -> ofetch; 绝对地址不走后端 baseURL)
 */

import { $fetch } from "ofetch"

import type { ResPromise } from "@/api/response"

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
export async function getIpInfoAPI(): ResPromise<IpInfoRes> {
    const urlStr = "http://ip-api.com/json/?lang=zh-CN"

    const res = await $fetch.raw<IpInfoRes>(urlStr, {
        method: "GET",
    })

    return {
        data: res._data as IpInfoRes,
        status: res.status,
        statusText: res.statusText || "",
        headers: Object.fromEntries(new Headers(res.headers).entries()),
        config: {},
    }
}
