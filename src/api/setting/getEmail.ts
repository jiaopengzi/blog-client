/**
 * @FilePath     : \blog-client\src\api\setting\getEmail.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取邮箱信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface GetEmailResponse {
    host: string
    user_name: string
    from: string
    password: string
    port: number
    max_send_count: number
    send_interval: number
    pool_size: number
}

// 获取邮箱信息
export function getEmailAPI(): ResPromise<Res<GetEmailResponse>> {
    const urlStr = routerGroup + "/setting/get-email"
    return request({
        url: urlStr,
        method: "get",
    })
}
