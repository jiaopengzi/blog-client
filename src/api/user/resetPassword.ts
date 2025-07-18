/**
 * @FilePath     : \blog-client\src\api\user\resetPassword.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 忘记密码
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface ResetPasswordRequest {
    captcha: string
    email: string
    password: string
    re_password: string
}

// 注册
export function resetPasswordAPI(requestData: ResetPasswordRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/user/reset-password"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
