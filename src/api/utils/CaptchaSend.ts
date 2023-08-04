/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-02 13:51:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-02 14:03:29
 * @FilePath     : \vuestudy\src\api\user\SendCaptcha.ts
 * @Description  :
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '../request.ts'
import { routerGroup } from '../routerGroup.ts'
import type { AxiosPromise } from 'axios'

export interface CaptchaSendRequest {
  email: string
}

export interface CaptchaSendResponse {
  code: number
  msg: string
  data: any // 可以根据实际返回的数据结构替换为更具体的类型
}

// 检测验证码是否正确
export function captchaSendByJosn(requestData: string): AxiosPromise<CaptchaSendResponse> {
  const urlStr = routerGroup + '/utils/captcha-send'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
