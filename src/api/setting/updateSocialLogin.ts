/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-20 11:30:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-20 11:32:11
 * @FilePath     : \blog-client\src\api\setting\updateSocialLogin.ts
 * @Description  : 更新社交登录信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { GetSocialLoginResponse } from "./getSocialLogin" // 复用类型

export type UpdateSocialLoginRequest = GetSocialLoginResponse

// 更新社交登录信息
export function updateSocialLoginAPI(requestData: UpdateSocialLoginRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/option/update-social-login"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
