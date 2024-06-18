/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 08:52:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-18 15:29:38
 * @FilePath     : \blog-client\src\api\user\editUser.ts
 * @Description  : 编辑用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface EditUserRequest {
  excluding_user_id: string // 用户id
  user_name: string // 用户名
  email: string // 邮箱
  status: string // 状态
  password: string // 密码
  role_name: string // 角色
  nick_name: string // 昵称
  sex: string // 性别
  description: string // 描述
}

export interface EditUserResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 注册
export function EditUserByJosn(requestData: EditUserRequest): AxiosPromise<EditUserResponse> {
  const urlStr = routerGroup + '/user/edit'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
