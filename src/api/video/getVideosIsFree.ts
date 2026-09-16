/*
 * FilePath    : blog-client\src\api\video\getVideosIsFree.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看视频是否免费
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 查看视频是否免费请求
export interface GetVideosIsFreeRequest {
    file_id_hash_list: string[]
}

// 查看视频是否免费响应
export interface GetVideosIsFreeResponse {
    file_id_hash: string
    is_free: boolean
}

export function getVideosIsFreeAPI(requestData: GetVideosIsFreeRequest): ResPromise<Res<GetVideosIsFreeResponse[]>> {
    return request({
        url: `${routerGroup}/video/is-free`,
        method: "post",
        data: requestData,
    })
}
