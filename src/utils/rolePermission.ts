/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-07 14:24:11
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-07 22:25:48
 * @FilePath     : \blog-client\src\utils\rolePermission.ts
 * @Description  : 权限工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// 从 API 获取权限列表

import { getPermissions } from '@/api/utils/permission'
import { getRoles } from '@/api/utils/role'
import { ResponseCode } from '@/api/responseCode'
import { kebabToPascalCase } from '@/utils/naming-conversion'

// 权限枚举
export enum PermissionNames {
  AddMedia = 'AddMedia',
  EditMedia = 'EditMedia',
  DeleteMedia = 'DeleteMedia',
  ViewMedia = 'ViewMedia',
  AddPost = 'AddPost',
  EditPost = 'EditPost',
  DeletePost = 'DeletePost',
  ViewPost = 'ViewPost',
  LoginAdmin = 'LoginAdmin',
}

/**
 * @description: 获取角色列表
 * @return {Promise<any>}
 */
export async function getRolesList() {
  const res = await getRoles()
  if (res.data.code === ResponseCode.GetRoleSuccess) {
    return res.data.data
  }
  return []
}

// 开发环境下检查权限枚举是否有遗漏
export async function devPermissionNames() {
  let newPermissionNames = ''
  const res = await getPermissions()
  if (res.data.code === ResponseCode.GetPermissionSuccess) {
    const permissions = res.data.data
    for (let i = 0; i < permissions.length; i++) {
      const keyPascalCase = kebabToPascalCase(permissions[i].permission_name)
      if (!(keyPascalCase in PermissionNames)) {
        // 如果 key 中包含 - 则添加
        const _enum = `${keyPascalCase} = '${keyPascalCase}',`
        newPermissionNames += _enum + '\n'
      }
    }
    if (newPermissionNames) {
      console.error(
        '前端权限和后端权限有差异:\n 请将如下内容添加到枚举 enum PermissionNames 中\n' +
          newPermissionNames,
      )
    }
  }
}
