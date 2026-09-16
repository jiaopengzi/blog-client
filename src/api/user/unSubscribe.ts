/*
 * FilePath    : blog-client\src\api\user\unSubscribe.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 取消订阅
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface UnSubscribeRequest {
    token: string
}

// 取消订阅
export function unSubscribeAPI(data: UnSubscribeRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/unsubscribe"
    return request({
        url: urlStr,
        method: "post",
        data,
    })
}
