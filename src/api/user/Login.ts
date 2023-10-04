/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 19:57:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-04 14:52:35
 * @FilePath     : \blog-client\src\api\user\Login.ts
 * @Description  : 登录
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '../request.ts'
import { routerGroup } from '../routerGroup.ts'
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

// 注册
export function loginByJosn(requestData: string): AxiosPromise<LoginResponse> {
  const urlStr = routerGroup + '/user/login'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
