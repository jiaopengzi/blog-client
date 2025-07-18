/**
 * @FilePath     : \blog-client\src\api\user\register.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 注册
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface RegisterRequest {
    captcha: string
    user_name: string
    password: string
    re_password: string
    email: string
}

// 注册
export function registerAPI(requestData: RegisterRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/register"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
