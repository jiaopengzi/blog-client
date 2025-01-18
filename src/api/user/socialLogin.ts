/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-18 16:27:07
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-18 18:27:56
 * @FilePath     : \blog-client\src\api\user\socialLogin.ts
 * @Description  : 三方登录
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import type { SocialLoginType } from "@/api/common"
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 三方登录
export function socialLogin(loginType: SocialLoginType): ResPromise<Res<string>> {
    const urlStr = `${routerGroup}/social/login?state=login&login-type=${loginType}`
    return request({
        url: urlStr,
        method: "get",
    })
}

// 三方登录回调
export function socialLoginCallback(code: string, loginType: SocialLoginType): ResPromise<Res<unknown>> {
    const urlStr = `${routerGroup}/social/login/callback?code=${code}&login-type=${loginType}`
    return request({
        url: urlStr,
        method: "get",
    })
}

// 三方绑定
export function socialBind(loginType: SocialLoginType): ResPromise<Res<string>> {
    const urlStr = `${routerGroup}/social/bind?state=bind&login-type=${loginType}`
    return request({
        url: urlStr,
        method: "get",
    })
}

// QQ绑定回调
export function socialBindCallback(code: string, loginType: SocialLoginType): ResPromise<Res<unknown>> {
    const urlStr = `${routerGroup}/social/bind/callback?code=${code}&login-type=${loginType}`
    return request({
        url: urlStr,
        method: "get",
    })
}

// 三方解绑
export function socialUnBind(loginType: SocialLoginType): ResPromise<Res<unknown>> {
    console.log("===============>05", loginType)
    const urlStr = `${routerGroup}/social/unbind?login-type=${loginType}`
    return request({
        url: urlStr,
        method: "get",
    })
}
