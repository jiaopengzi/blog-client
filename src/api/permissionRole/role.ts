/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-07 21:01:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-13 14:52:25
 * @FilePath     : \blog-client\src\api\permission\role.ts
 * @Description  : 角色相关
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'
import { PermissionNames } from '@/utils/permissionRole'

export interface RolesResponse {
  code: number
  msg: string
  data: Role[]
}

export function getRolesByJson(): AxiosPromise<RolesResponse> {
  return request({
    url: routerGroup + '/role/get-roles',
    method: 'get',
  })
}

export interface Role {
  role_name: string
  permission_names: PermissionNames[]
  description: string
}
