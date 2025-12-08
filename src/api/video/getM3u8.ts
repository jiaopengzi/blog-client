/**
 * @FilePath     : \blog-client\src\api\video\getM3u8.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取视频m3u8
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface M3u8ResData {
    base_url: string
    m3u8: string
}

export function getM3u8API(fileIdHashResolution: string, postId: string = ""): ResPromise<Res<M3u8ResData>> {
    if (postId) {
        fileIdHashResolution += `/post-id/${postId}`
    } else {
        fileIdHashResolution += `/post-id/0`
    }

    return request({
        url: `${routerGroup}/video/${fileIdHashResolution}`,
        method: "get",
    })
}

// 管理员获取， postId 作为占位符无实际意义，保证接口统一
export function getM3u8AdminAPI(fileIdHashResolution: string, postId: string = ""): ResPromise<Res<M3u8ResData>> {
    return request({
        url: `${routerGroup}/video/admin/${fileIdHashResolution}`,
        method: "get",
    })
}
