/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-21 16:19:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-21 16:20:37
 * @FilePath     : \blog-client\src\api\setting\getSocialLoginStatus.ts
 * @Description  : 获取社交登录状态信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export interface GetSocialLoginStatusResponse {
    qq: boolean
    wechat: boolean
}

// 获取社交登录状态信息
export function getSocialLoginStatusAPI(): ResPromise<Res<GetSocialLoginStatusResponse>> {
    const urlStr = routerGroup + "/option/get-social-login-status"
    return request({
        url: urlStr,
        method: "get",
    })
}
