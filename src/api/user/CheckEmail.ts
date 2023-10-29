/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-14 18:00:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-29 19:58:55
 * @FilePath     : \blog-client\src\api\user\checkEmail.ts
 * @Description  : 邮箱查重
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import request from '../request'
import { routerGroup } from '../routerGroup'
import type { AxiosPromise } from 'axios'

export interface CheckEmailRequest {
  email: string
}

export interface CheckEmailResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 检测用户名是否存在
export function CheckEmailByJosn(requestData: CheckEmailRequest): AxiosPromise<CheckEmailResponse> {
  const urlStr = routerGroup + '/user/check-email'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
