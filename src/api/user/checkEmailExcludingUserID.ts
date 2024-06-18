/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 13:30:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-18 14:14:44
 * @FilePath     : \blog-client\src\api\user\checkEmailExcludingUserID.ts
 * @Description  : 校验邮箱是否唯一 排除指定用户ID
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface CheckEmailExcludingUserIDRequest {
  excluding_user_id: string // 需要排除的用户id
  email: string
}

export interface CheckEmailExcludingUserIDResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 检测用户名是否存在
export function checkEmailExcludingUserIDByJosn(
  requestData: CheckEmailExcludingUserIDRequest,
): AxiosPromise<CheckEmailExcludingUserIDResponse> {
  const urlStr = routerGroup + '/user/check-email-excluding-user-id'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
