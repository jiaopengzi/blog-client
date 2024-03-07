/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-07 10:39:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-07 10:42:56
 * @FilePath     : \blog-client\src\api\utils\permission.ts
 * @Description  : 权限
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import type { AxiosPromise } from 'axios'
import { routerGroup } from '@/api/routerGroup'

export interface PermissionsResponse {
  code: number
  msg: string
  data: any
}

export function getPermissions(): AxiosPromise<PermissionsResponse> {
  return request({
    url: routerGroup + '/utils/get-permissions',
    method: 'get',
  })
}
