/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-12 12:38:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-29 20:01:02
 * @FilePath     : \blog-client\src\api\user\ResetPassword.ts
 * @Description  : 忘记密码
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '../request'
import { routerGroup } from '../routerGroup'
import type { AxiosPromise } from 'axios'

export interface ResetPasswordRequest {
  captcha: string
  email: string
  password: string
  re_password: string
}

export interface ResetPasswordResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 注册
export function resetPasswordByJosn(
  requestData: ResetPasswordRequest
): AxiosPromise<ResetPasswordResponse> {
  const urlStr = routerGroup + '/user/reset-password'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
