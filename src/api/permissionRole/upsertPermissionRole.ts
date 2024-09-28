/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-26 16:54:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-28 11:56:30
 * @FilePath     : \blog-client\src\api\permissionRole\upsertPermissionRole.ts
 * @Description  : 插入或更新角色权限
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from '@/api/request'
import { routerGroup } from '@/api/routerGroup'
import type { AxiosPromise } from 'axios'
import { PermissionNames } from '@/utils/permissionRole'
import { type Res } from '@/api/responseCode'

//  插入或更新角色权限 请求参数
export interface UpsertPermissionRoleRequest {
  permission_name: PermissionNames // 权限名称
  role_name: string // 角色名称
  limit_count: number // 限制次数
  limit_period: number // 限制周期(秒数)
}

// 更新列表角色权限
export function upsertPermissionRoleAPI(
  requestData: UpsertPermissionRoleRequest,
): AxiosPromise<Res> {
  const urlStr = routerGroup + '/role/upsert-permission-role'
  return request({
    url: urlStr,
    method: 'post',
    data: requestData,
  })
}
