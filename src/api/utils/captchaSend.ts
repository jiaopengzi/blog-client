/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-02 13:51:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-29 20:01:18
 * @FilePath     : \blog-client\src\api\utils\CaptchaSend.ts
 * @Description  : 验证码发送
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface CaptchaSendRequest {
  email: string
  ip: string
  purpose: string // 验证码用途
}

export interface CaptchaSendResponse {
  code: number
  msg: string
  data: any // 可以根据实际返回的数据结构替换为更具体的类型
}

// 检测验证码是否正确
export function captchaSendByJosn(
  requestData: CaptchaSendRequest,
): AxiosPromise<CaptchaSendResponse> {
  const urlStr = routerGroup + '/utils/captcha-send'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
