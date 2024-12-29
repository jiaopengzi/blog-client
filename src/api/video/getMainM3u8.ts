/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 15:21:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 12:59:49
 * @FilePath     : \blog-client\src\api\video\getMainM3u8.ts
 * @Description  : 获取视频主 m3u8
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export function getMainM3u8API(videoId: string): ResPromise<Res<string>> {
    return request({
        url: `${routerGroup}/video/${videoId}`,
        method: "get",
    })
}
