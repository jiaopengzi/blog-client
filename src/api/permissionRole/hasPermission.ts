/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-13 14:40:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-13 14:44:42
 * @FilePath     : \blog-client\src\api\permission\hasPermission.ts
 * @Description  : 判断是否具有权限
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import { PermissionNames } from '@/utils/permissionRole'

// 判断是否具有权限 请求参数
export interface HasPermissionRequest {
  permission_name: PermissionNames
}

// 判断是否具有权限 返回参数
export interface HasPermissionResponse {
  code: number
  msg: string
  data: boolean
}

// 注册
export function hasPermissionByJosn(
  requestData: HasPermissionRequest,
): AxiosPromise<HasPermissionResponse> {
  const urlStr = routerGroup + '/permission/has-permission'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
