/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-13 15:34:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-07-14 19:54:38
 * @FilePath     : \blog-client\src\api\user\register.ts
 * @Description  : 注册
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '../request.ts'
import { routerGroup } from '../routerGroup.ts'
import type { AxiosPromise } from 'axios'

export interface RegisterRequest {
  user_name: string
  password: string
  re_password: string
  email: string
}

export interface RegisterResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 注册
export function RegisterByJosn(requestData: string): AxiosPromise<RegisterResponse> {
  const urlStr = routerGroup + '/user/register'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
