/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-16 15:12:20
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-16 21:33:26
 * @FilePath     : \blog-client\src\api\user\addUser.ts
 * @Description  : 添加用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface AddUserRequest {
  user_name: string // 用户名
  email: string // 邮箱
  password: string // 密码
  role_name: string // 角色
  is_send_email: boolean // 是否发送邮件
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
