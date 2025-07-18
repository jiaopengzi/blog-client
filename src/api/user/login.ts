/**
 * @FilePath     : \blog-client\src\api\user\login.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 登录
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface LoginRequest {
    login_name: string
    password: string
}

// 默认账号登录
export function loginAPI(loginRequest: LoginRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/login"
    return request({
        url: urlStr,
        method: "post",
        data: loginRequest,
    })
}
