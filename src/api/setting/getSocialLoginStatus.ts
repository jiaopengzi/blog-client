/**
 * @FilePath     : \blog-client\src\api\setting\getSocialLoginStatus.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取社交登录状态信息
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface GetSocialLoginStatusResponse {
    qq: boolean
    wechat: boolean
}

// 获取社交登录状态信息
export function getSocialLoginStatusAPI(): ResPromise<Res<GetSocialLoginStatusResponse>> {
    const urlStr = routerGroup + "/setting/get-social-login-status"
    return request({
        url: urlStr,
        method: "get",
    })
}
