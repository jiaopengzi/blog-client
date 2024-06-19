/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 15:40:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-19 10:50:35
 * @FilePath     : \blog-client\src\api\user\getUserInfoByUserID.ts
 * @Description  : 通过用户ID 获取用户信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import type { GetUserInfoResponse } from '@/api/user/getUserInfo'

export interface GetUserInfoByUserIDRequest {
  user_id: string // 用户id
}

// 获取用户信息
export function getUserInfoByUserIDAPI(
  requestData: GetUserInfoByUserIDRequest,
): AxiosPromise<GetUserInfoResponse> {
  const urlStr = routerGroup + '/user/info-by-user-id'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
