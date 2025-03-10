/**
 * @FilePath     : \blog-client\src\api\user\checkEmail.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 邮箱查重
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface CheckEmailRequest {
    email: string
}

// 检测用户名是否存在
export function CheckEmailAPI(requestData: CheckEmailRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/check-email"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
