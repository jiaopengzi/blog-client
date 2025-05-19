/**
 * @FilePath     : \blog-client\src\api\user\socialLogin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 社交登录
 */

import type { SocialLoginType } from "@/api/common"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 社交登录
export function socialLogin(loginType: SocialLoginType): ResPromise<Res<string>> {
    const urlStr = `${routerGroup}/social/login?state=login&login-type=${loginType}`
    return request({
        url: urlStr,
        method: "get",
    })
}

// 社交登录回调
export function socialLoginCallback(code: string, loginType: SocialLoginType): ResPromise<Res<unknown>> {
    const urlStr = `${routerGroup}/social/login/callback?code=${code}&login-type=${loginType}`
    return request({
        url: urlStr,
        method: "get",
    })
}

// 社交绑定
export function socialBind(loginType: SocialLoginType): ResPromise<Res<string>> {
    const urlStr = `${routerGroup}/social/bind?state=bind&login-type=${loginType}`
    return request({
        url: urlStr,
        method: "get",
    })
}

// 绑定回调
export function socialBindCallback(code: string, loginType: SocialLoginType): ResPromise<Res<unknown>> {
    const urlStr = `${routerGroup}/social/bind/callback?code=${code}&login-type=${loginType}`
    return request({
        url: urlStr,
        method: "get",
    })
}

// 社交解绑
export function socialUnBind(loginType: SocialLoginType): ResPromise<Res<unknown>> {
    const urlStr = `${routerGroup}/social/unbind?login-type=${loginType}`
    return request({
        url: urlStr,
        method: "get",
    })
}
