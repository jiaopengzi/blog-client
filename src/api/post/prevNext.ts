/*
 * FilePath    : blog-client\src\api\post\prevNext.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 上一篇下一篇
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface PrevNextRequest {
    post_id: string // 文章ID
}

export interface PrevNextItem {
    id: string
    post_title: string
    thumbnail: string
}

export interface PrevNextResponse {
    prev: PrevNextItem
    next: PrevNextItem
}

// 查看上一篇下一篇
export function prevNextPostAPI(requestData: PrevNextRequest): ResPromise<Res<PrevNextResponse>> {
    const urlStr = routerGroup + "/post/prev-next"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
