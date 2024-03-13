/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-07 14:24:11
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-13 16:21:37
 * @FilePath     : \blog-client\src\utils\permissionRole.ts
 * @Description  : 权限工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// 从 API 获取权限列表

import { getPermissions } from '@/api/permissionRole/getPermissions'
import { getRoles } from '@/api/permissionRole/role'
import { ResponseCode } from '@/api/responseCode'
import { kebabToPascalCase } from '@/utils/naming-conversion'
import { hasPermissionByJosn } from '@/api/permissionRole/hasPermission'

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

// 判断是否有权限
export async function hasPermission(permission: PermissionNames) {
  const res = await hasPermissionByJosn({ permission_name: permission })
  return res.data.code === ResponseCode.HasPermission
}

/**
 * @description: 根据用户权限动态加载组件
 * @param {PermissionNames} permission - 需要的权限
 * @param {string} componentPath - 用户有权限时加载的组件路径
 * @param {string} fallbackComponentPath - 用户无权限时加载的组件路径
 * @return {Promise<any>}
 */
export async function loadComponentByPermission(
  permission: PermissionNames,
  componentPath: string,
  fallbackComponentPath: string,
) {
  if (await hasPermission(permission)) {
    switch (componentPath) {
      case 'admin':
        return import('@/views/admin')
      // 其他可能的组件路径
      // case 'otherComponent':
      //   return import('@/views/otherComponent.vue');
    }
  } else {
    switch (fallbackComponentPath) {
      case '404':
        return import('@/views/404')
    }
  }
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
