/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-20 16:30:57
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-20 16:44:52
 * @FilePath     : \blog-client\src\api\user\getUsers.ts
 * @Description  : 获取用户信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import type { DataWithImg, Pagination } from '@/components/common'

export interface GetUsersResponse {
  code: number
  msg: string
  data: {
    users: User[] // 用户列表
    pagination: Pagination // 分页信息
  } // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 获取用户信息
export function getUsersByJosn(): AxiosPromise<GetUsersResponse> {
  const urlStr = routerGroup + '/user/all'
  return request({
    url: urlStr,
    method: 'get',
  })
}

// 用户信息
export interface User extends DataWithImg {
  id: number // 用户 ID
  user_name: string // 用户名
  nickname: string // 昵称
  email: string // 邮箱
  role: string // 角色
  status: string // 状态
  post: number // 文章数量
  created_at: string // 注册时间
}
