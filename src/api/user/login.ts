/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 19:57:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 10:50:53
 * @FilePath     : \blog-client\src\api\user\login.ts
 * @Description  : 登录
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"

export interface LoginRequest {
    login_name: string
    password: string
}

// 默认账号登录
export function loginAPI(loginRequest: LoginRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/user/login"
    return request({
        url: urlStr,
        method: "post",
        data: loginRequest,
    })
}

// QQ登录
export function loginByQQUrl(): AxiosPromise<Res> {
    const urlStr = routerGroup + "/social/qq/login"
    return request({
        url: urlStr,
        method: "get",
    })
}

// QQ登录回调
export function loginByQQUrlCallback(code: string): AxiosPromise<Res> {
    const urlStr = routerGroup + "/social/qq/login/callback?code=" + code
    return request({
        url: urlStr,
        method: "get",
    })
}

// QQ绑定
export function bindQQUrl(): AxiosPromise<Res> {
    const urlStr = routerGroup + "/social/qq/bind"
    return request({
        url: urlStr,
        method: "get",
    })
}

// QQ绑定回调
export function bindQQUrlCallback(code: string): AxiosPromise<Res> {
    const urlStr = routerGroup + "/social/qq/bind/callback?code=" + code
    return request({
        url: urlStr,
        method: "get",
    })
}

// QQ 解绑
export function unBindQQ(): AxiosPromise<Res> {
    const urlStr = routerGroup + "/social/qq/unbind"
    return request({
        url: urlStr,
        method: "get",
    })
}

// 微信登录
export function loginByWeChatUrl(): AxiosPromise<Res> {
    const urlStr = routerGroup + "/social/wechat/login"
    return request({
        url: urlStr,
        method: "get",
    })
}

// 微信登录回调
export function loginByWeChatUrlCallback(code: string): AxiosPromise<Res> {
    const urlStr = routerGroup + "/social/wechat/login/callback?code=" + code
    return request({
        url: urlStr,
        method: "get",
    })
}

// 微信绑定
export function bindWeChatUrl(): AxiosPromise<Res> {
    const urlStr = routerGroup + "/social/wechat/bind"
    return request({
        url: urlStr,
        method: "get",
    })
}

// 微信绑定回调
export function bindWeChatUrlCallback(code: string): AxiosPromise<Res> {
    const urlStr = routerGroup + "/social/wechat/bind/callback?code=" + code
    return request({
        url: urlStr,
        method: "get",
    })
}

// 微信解绑
export function unBindWeChat(): AxiosPromise<Res> {
    const urlStr = routerGroup + "/social/wechat/unbind"
    return request({
        url: urlStr,
        method: "get",
    })
}
