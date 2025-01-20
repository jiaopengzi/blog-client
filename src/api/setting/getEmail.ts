/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-20 11:19:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-20 11:23:27
 * @FilePath     : \blog-client\src\api\setting\getEmail.ts
 * @Description  : 获取邮箱信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface GetEmailResponse {
    port: number
    host: string
    user_name: string
    from: string
    password: string
}

// 获取数据库信息
export function getEmailAPI(): ResPromise<Res<GetEmailResponse>> {
    const urlStr = routerGroup + "/option/get-email"
    return request({
        url: urlStr,
        method: "get",
    })
}
