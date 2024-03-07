/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-07 09:58:39
 * @FilePath     : \blog-client\src\api\captcha\captchaCheck.ts
 * @Description  : 验证码校验
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface CaptchaCheckRequest {
  email: string
  captcha: string
  purpose: string // 验证码用途
}

export interface CaptchaCheckResponse {
  code: number
  msg: string
  data: any // 可以根据实际返回的数据结构替换为更具体的类型
}

// 检测验证码是否正确
export function captchaCheckByJosn(
  requestData: CaptchaCheckRequest,
): AxiosPromise<CaptchaCheckResponse> {
  const urlStr = routerGroup + '/captcha/check'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
