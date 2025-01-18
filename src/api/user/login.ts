/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 19:57:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-18 16:27:45
 * @FilePath     : \blog-client\src\api\user\login.ts
 * @Description  : 登录
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface LoginRequest {
    login_name: string
    password: string
}

// 默认账号登录
export function loginAPI(loginRequest: LoginRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/user/login"
    return request({
        url: urlStr,
        method: "post",
        data: loginRequest,
    })
}
