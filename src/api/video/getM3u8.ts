/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 15:23:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 10:12:59
 * @FilePath     : \blog-client\src\api\video\getM3u8.ts
 * @Description  : 获取视频m3u8
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import type { AxiosPromise } from "axios"
import { routerGroup } from "@/api/routerGroup"
import { type Res } from "@/api/responseCode"

export interface M3u8ResData {
    base_url: string
    m3u8: string
}

export function getM3u8API(videoIdLevel: string): AxiosPromise<Res<M3u8ResData>> {
    return request({
        url: `${routerGroup}/video/${videoIdLevel}`,
        method: "get",
    })
}
