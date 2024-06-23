/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-12 12:38:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-23 16:18:38
 * @FilePath     : \blog-client\src\api\user\resetPassword.ts
 * @Description  : 忘记密码
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import { type Res } from '@/api/responseCode'

export interface ResetPasswordRequest {
  captcha: string
  email: string
  password: string
  re_password: string
}

// 注册
export function resetPasswordAPI(requestData: ResetPasswordRequest): AxiosPromise<Res> {
  const urlStr = routerGroup + '/user/reset-password'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
