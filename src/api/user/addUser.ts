/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-16 15:12:20
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-16 15:12:34
 * @FilePath     : \blog-client\src\api\user\addUser.ts
 * @Description  : 添加用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface AddUserRequest {
  admin_user_id: string
  user_name: string
  email: string
  password: string
}

export interface AddUserResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 注册
export function AddUserByJosn(requestData: AddUserRequest): AxiosPromise<AddUserResponse> {
  const urlStr = routerGroup + '/user/add'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
