/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-14 17:04:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-07-14 18:01:12
 * @FilePath     : \blog-client\src\api\user\CheckUserNme.ts
 * @Description  : 用户查重
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '../request.ts'
import { routerGroup } from '../routerGroup.ts'
import type { AxiosPromise } from 'axios'

export interface CheckUserNameRequest {
  user_name: string
}

export interface CheckUserNameResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 检测用户名是否存在
export function checkUserNameByJosn(requestData: string): AxiosPromise<CheckUserNameResponse> {
  const urlStr = routerGroup + '/user/check-username'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
