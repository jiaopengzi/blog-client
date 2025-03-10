/**
 * @FilePath     : \blog-client\src\api\setting\getSocialLogin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取社交登录信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface LoginConfig {
    app_id: string
    app_key: string
    base_url: string
    redirect_uri: string
    redirect_uri_bind: string
    is_enabled: boolean
}

export interface GetSocialLoginResponse {
    qq: LoginConfig
    wechat: LoginConfig
}

// 获取社交登录信息
export function getSocialLoginAPI(): ResPromise<Res<GetSocialLoginResponse>> {
    const urlStr = routerGroup + "/option/get-social-login"
    return request({
        url: urlStr,
        method: "get",
    })
}
