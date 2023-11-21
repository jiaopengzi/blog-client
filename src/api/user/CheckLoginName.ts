/**
 * @Author       : jiaopengzi
 * @Date         : 2023-08-12 13:03:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-27 15:00:46
 * @FilePath     : \blog-client\src\api\user\checkLoginName.ts
 * @Description  : 检查登录名是否存在
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface CheckLoginNameRequest {
  login_name: string
}

export interface CheckLoginNameResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 检测用户名是否存在
export function checkLoginNameByJosn(
  requestData: CheckLoginNameRequest
): AxiosPromise<CheckLoginNameResponse> {
  const urlStr = routerGroup + '/user/check-loginname'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
