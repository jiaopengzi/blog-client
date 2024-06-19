/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 10:43:02
 * @FilePath     : \blog-client\src\api\captcha\check.ts
 * @Description  : 验证码校验
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import { type Res } from '@/api/responseCode'
import type { AxiosPromise } from 'axios'

export interface CaptchaCheckRequest {
  ip: string
  email: string
  captcha: string
  purpose: string // 验证码用途
}

// 检测验证码是否正确
export function captchaCheckAPI(requestData: CaptchaCheckRequest): AxiosPromise<Res> {
  const urlStr = routerGroup + '/captcha/check'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
