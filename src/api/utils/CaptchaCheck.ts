/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-02 13:38:31
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-01 14:05:14
 * @FilePath     : \blog-client\src\api\utils\CaptchaCheck.ts
 * @Description  : 验证码校验
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '../request.ts'
import { routerGroup } from '../routerGroup.ts'
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
export function captchaCheckByJosn(requestData: string): AxiosPromise<CaptchaCheckResponse> {
  const urlStr = routerGroup + '/utils/captcha-check'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
