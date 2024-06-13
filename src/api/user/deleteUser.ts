/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-13 16:35:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-13 19:31:39
 * @FilePath     : \blog-client\src\api\user\deleteUser.ts
 * @Description  : 删除用户
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'

export interface DeleteUserRequest {
  user_id_list: string[] // 用户 id 列表
}

export interface DeleteUserResponse {
  code: number
  msg: string
  data: any // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 注册
export function DeleteUserByJosn(requestData: DeleteUserRequest): AxiosPromise<DeleteUserResponse> {
  const urlStr = routerGroup + '/user/delete'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
