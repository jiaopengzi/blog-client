/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-21 20:26:33
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-11 17:34:33
 * @FilePath     : \blog-client\src\api\user\bindEmail.ts
 * @Description  : 绑定邮箱
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// import request from '../request'
import request from '@/api/request'
import { routerGroup } from '@/api//routerGroup'
import type { AxiosPromise } from 'axios'

export interface BindEmailRequest {
  ip: string
  email: string
  captcha: string
}

export interface BindEmailResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 注册
export function bindEmailByJosn(requestData: BindEmailRequest): AxiosPromise<BindEmailResponse> {
  const urlStr = routerGroup + '/user/bind-email'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
