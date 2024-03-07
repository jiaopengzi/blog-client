/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-07 21:01:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-07 21:01:43
 * @FilePath     : \blog-client\src\api\utils\role.ts
 * @Description  : 角色相关
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'

export interface RolesResponse {
  code: number
  msg: string
  data: any
}

export function getRoles(): AxiosPromise<RolesResponse> {
  return request({
    url: routerGroup + '/role/get-roles',
    method: 'get',
  })
}
