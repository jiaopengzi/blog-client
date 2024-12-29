/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-13 15:34:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-23 16:18:55
 * @FilePath     : \blog-client\src\api\user\register.ts
 * @Description  : 注册
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
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
export function RegisterAPI(requestData: RegisterRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/register"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
