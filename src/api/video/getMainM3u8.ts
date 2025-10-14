/**
 * @FilePath     : \blog-client\src\api\video\getMainM3u8.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取视频主 m3u8
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export function getMainM3u8API(fileIdHash: string): ResPromise<Res<string>> {
    return request({
        url: `${routerGroup}/video/${fileIdHash}`,
        method: "get",
    })
}
