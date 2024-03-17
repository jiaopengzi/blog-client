/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-07 14:24:11
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-17 15:38:50
 * @FilePath     : \blog-client\src\utils\permissionRole.ts
 * @Description  : 权限工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// 从 API 获取权限列表
import type { Directive, DirectiveBinding } from 'vue'
import { getPermissionsByJson } from '@/api/permissionRole/getPermissions'
import { getRolesByJson } from '@/api/permissionRole/role'
import { ResponseCode } from '@/api/responseCode'
import { kebabToPascalCase } from '@/utils/namingConversion'
import { hasPermissionByJosn } from '@/api/permissionRole/hasPermission'
import { useUserStore } from '@/stores/user'

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
  Backup = 'Backup',
  PermissionRole = 'PermissionRole',
}

/**
 * @description: 获取角色列表
 * @return {Promise<any>}
 */
export async function getRolesList(): Promise<any> {
  const res = await getRolesByJson()
  if (res.data.code === ResponseCode.GetRoleSuccess) {
    return res.data.data
  }
  return []
}

/**
 * @description: 获取权限列表
 * @return {Promise<any>}
 */
export async function getPermissionList(): Promise<any> {
  const res = await getPermissionsByJson()
  if (res.data.code === ResponseCode.GetPermissionSuccess) {
    return res.data.data
  }
  return []
}

// 判断是否有权限
export async function hasPermissionByServer(permission: PermissionNames): Promise<boolean> {
  const res = await hasPermissionByJosn({ permission_name: permission })
  return res.data.code === ResponseCode.HasPermission
}

// 权限指令,如果没有权限则移除元素.
export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionNames>) {
    // 获取用户信息
    const userStore = useUserStore()
    const permission = binding.value
    const hasPerm = userStore.hasPermission(permission)
    if (!hasPerm) {
      el.parentNode?.removeChild(el)
    }
  },
}

// 开发环境下检查权限枚举是否有遗漏
export async function devPermissionNames() {
  let newPermissionNames = ''
  const res = await getPermissionsByJson()
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
