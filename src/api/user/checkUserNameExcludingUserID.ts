/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 13:28:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-18 13:35:56
 * @FilePath     : \blog-client\src\api\user\checkUserNameExcludingUserID.ts
 * @Description  : 校验用户名是否唯一 排除指定用户ID
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface CheckUserNameExcludingUserIDRequest {
  excluding_user_id: string // 需要排除的用户id
  user_name: string
}

export interface CheckUserNameExcludingUserIDResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 检测用户名是否存在
export function checkUserNameExcludingUserIDByJosn(
  requestData: CheckUserNameExcludingUserIDRequest,
): AxiosPromise<CheckUserNameExcludingUserIDResponse> {
  const urlStr = routerGroup + '/user/check-username-excluding-user-id'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
