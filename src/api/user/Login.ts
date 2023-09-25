/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-11 19:57:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-12 13:01:06
 * @FilePath     : \blog-client\src\api\user\Login.ts
 * @Description  : 登录
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '../request.ts'
import { routerGroup } from '../routerGroup.ts'
import type { AxiosPromise } from 'axios'

export interface loginRequest {
  login_name: string
  password: string
}

export interface loginResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 注册
export function loginByJosn(requestData: string): AxiosPromise<loginResponse> {
  const urlStr = routerGroup + '/user/login'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
