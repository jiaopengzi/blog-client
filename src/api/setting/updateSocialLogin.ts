/**
 * @FilePath     : \blog-client\src\api\setting\updateSocialLogin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 更新社交登录信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { GetSocialLoginResponse } from "./getSocialLogin" // 复用类型

export type UpdateSocialLoginRequest = GetSocialLoginResponse

// 更新社交登录信息
export function updateSocialLoginAPI(requestData: UpdateSocialLoginRequest): ResPromise<Res<void>> {
    const urlStr = routerGroup + "/setting/update-social-login"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
