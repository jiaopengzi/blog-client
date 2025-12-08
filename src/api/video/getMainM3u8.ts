/**
 * @FilePath     : \blog-client\src\api\video\getMainM3u8.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取视频主 m3u8
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export function getMainM3u8API(fileIdHash: string, postId: string = ""): ResPromise<Res<string>> {
    if (postId) {
        fileIdHash += `/post-id/${postId}`
    } else {
        fileIdHash += `/post-id/0`
    }

    return request({
        url: `${routerGroup}/video/${fileIdHash}`,
        method: "get",
    })
}

// 管理员获取， postId 作为占位符无实际意义，保证接口统一
export function getMainM3u8AdminAPI(fileIdHash: string, postId: string = ""): ResPromise<Res<string>> {
    return request({
        url: `${routerGroup}/video/admin/${fileIdHash}`,
        method: "get",
    })
}
