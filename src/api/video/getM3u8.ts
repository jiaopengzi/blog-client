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

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface M3u8ResData {
    base_url: string
    m3u8: string
}

export function getM3u8API(videoIdLevel: string): ResPromise<Res<M3u8ResData>> {
    return request({
        url: `${routerGroup}/video/${videoIdLevel}`,
        method: "get",
    })
}
