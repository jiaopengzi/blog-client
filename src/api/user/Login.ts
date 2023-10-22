/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 19:57:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-22 13:17:00
 * @FilePath     : \blog-client\src\api\user\Login.ts
 * @Description  : 登录
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '../request'
import { routerGroup } from '../routerGroup'
import type { AxiosPromise } from 'axios'

export interface LoginRequest {
  login_name: string
  password: string
}

export interface LoginResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 默认账号登录
export function loginByJosn(loginRequest: LoginRequest): AxiosPromise<LoginResponse> {
  const urlStr = routerGroup + '/user/login'
  return request({
    url: urlStr,
    method: 'post',
    data: loginRequest,
  })
}

// QQ登录
export function loginByQQUrl(): AxiosPromise<LoginResponse> {
  const urlStr = routerGroup + '/social/qq'
  return request({
    url: urlStr,
    method: 'get',
  })
}

// QQ登录回调
export function loginByQQUrlCallback(code: string): AxiosPromise<LoginResponse> {
  const urlStr = routerGroup + '/social/qq/callback?code=' + code
  return request({
    url: urlStr,
    method: 'get',
  })
}

// QQ绑定
export function bindQQUrl(): AxiosPromise<LoginResponse> {
  const urlStr = routerGroup + '/social/qq/bind'
  return request({
    url: urlStr,
    method: 'get',
  })
}

// QQ绑定回调
export function bindQQUrlCallback(code: string): AxiosPromise<LoginResponse> {
  const urlStr = routerGroup + '/social/qq/bind/callback?code=' + code
  return request({
    url: urlStr,
    method: 'get',
  })
}

// QQ 解绑
export function unBindQQ(): AxiosPromise<LoginResponse> {
  const urlStr = routerGroup + '/social/qq/unbind'
  return request({
    url: urlStr,
    method: 'get',
  })
}

// 微信登录
export function loginByWechatUrl(): AxiosPromise<LoginResponse> {
  const urlStr = routerGroup + '/social/wechat'
  return request({
    url: urlStr,
    method: 'get',
  })
}

// 微信登录回调
export function loginByWechatUrlCallback(code: string): AxiosPromise<LoginResponse> {
  const urlStr = routerGroup + '/social/wechat/callback?code=' + code
  return request({
    url: urlStr,
    method: 'get',
  })
}
