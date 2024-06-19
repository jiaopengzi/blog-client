/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-13 15:34:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-04-03 18:41:09
 * @FilePath     : \blog-client\src\api\user\register.ts
 * @Description  : 注册
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import { type Res } from '@/api/responseCode'

export interface RegisterRequest {
  ip: string
  captcha: string
  user_name: string
  password: string
  re_password: string
  email: string
}

// 注册
export function RegisterAPI(requestData: RegisterRequest): AxiosPromise<Res> {
  const urlStr = routerGroup + '/user/register'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
