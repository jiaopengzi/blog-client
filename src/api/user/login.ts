/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 19:57:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-23 20:44:02
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

// QQ登录
export function loginByQQUrl(): ResPromise<Res<string>> {
    const urlStr = routerGroup + "/social/qq/login?state=login"
    return request({
        url: urlStr,
        method: "get",
    })
}

// QQ登录回调
export function loginByQQUrlCallback(code: string): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/social/qq/login/callback?code=" + code
    return request({
        url: urlStr,
        method: "get",
    })
}

// QQ绑定
export function bindQQUrl(): ResPromise<Res<string>> {
    const urlStr = routerGroup + "/social/qq/bind?state=bind"
    return request({
        url: urlStr,
        method: "get",
    })
}

// QQ绑定回调
export function bindQQUrlCallback(code: string): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/social/qq/bind/callback?code=" + code
    return request({
        url: urlStr,
        method: "get",
    })
}

// QQ 解绑
export function unBindQQ(): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/social/qq/unbind"
    return request({
        url: urlStr,
        method: "get",
    })
}

// 微信登录
export function loginByWeChatUrl(): ResPromise<Res<string>> {
    const urlStr = routerGroup + "/social/wechat/login"
    return request({
        url: urlStr,
        method: "get",
    })
}

// 微信登录回调
export function loginByWeChatUrlCallback(code: string): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/social/wechat/login/callback?code=" + code
    return request({
        url: urlStr,
        method: "get",
    })
}

// 微信绑定
export function bindWeChatUrl(): ResPromise<Res<string>> {
    const urlStr = routerGroup + "/social/wechat/bind"
    return request({
        url: urlStr,
        method: "get",
    })
}

// 微信绑定回调
export function bindWeChatUrlCallback(code: string): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/social/wechat/bind/callback?code=" + code
    return request({
        url: urlStr,
        method: "get",
    })
}

// 微信解绑
export function unBindWeChat(): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/social/wechat/unbind"
    return request({
        url: urlStr,
        method: "get",
    })
}
