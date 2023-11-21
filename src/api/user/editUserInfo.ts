/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-27 15:51:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-27 16:12:12
 * @FilePath     : \blog-client\src\api\user\editUserInfo.ts
 * @Description  :  修改用户信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface editUserInfoRequest {
  user_name: string
  nickname: string
  sex: string
  description: string
}

export interface editUserInfoResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 注册
export function editUserInfoByJosn(
  requestData: editUserInfoRequest
): AxiosPromise<editUserInfoResponse> {
  const urlStr = routerGroup + '/user/info-edit'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
