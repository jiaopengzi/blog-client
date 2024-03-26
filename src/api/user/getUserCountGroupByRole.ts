/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-26 15:02:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-26 15:12:47
 * @FilePath     : \blog-client\src\api\user\getUserCountGroupByRole.ts
 * @Description  : 用户统计
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface GetUsersRequest {
  current_page: number // 当前页
  page_size: number // 每页显示条数
  key_word?: string // 关键字
}

// 获取用户信息响应类型
export interface GetUserCountGroupByRoleResponse {
  code: number
  msg: string
  data: UserCountGroupByRole[] // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 获取用户信息 api 函数
export function getUserCountGroupByRoleByJosn(): AxiosPromise<GetUserCountGroupByRoleResponse> {
  const urlStr = routerGroup + '/user/count-group-by-role'
  return request({
    url: urlStr,
    method: 'get',
  })
}

// 用户统计
export interface UserCountGroupByRole {
  role_name: string // 角色名称
  user_count: number // 用户数量
}
