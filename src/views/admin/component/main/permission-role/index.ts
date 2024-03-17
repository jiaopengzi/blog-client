/**
 * @Author       : jiaopengzi
 * @Date         : 2024-03-15 15:09:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-17 16:10:34
 * @FilePath     : \blog-client\src\views\admin\component\main\permission-role\index.ts
 * @Description  : 权限角色管理
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
export { default } from './index.vue'
import { PermissionNames } from '@/utils/permissionRole'

// 定义角色接口
export interface Role {
  role_name: string // 角色名称
  permission_names: PermissionNames[] // 权限名称数组
  description: string // 角色描述
  allSelected?: boolean // 是否全选，可选属性
}

// 定义权限接口
export interface Permission {
  permission_name: PermissionNames // 权限名称
  description: string // 权限描述
}

// 定义权限行接口，权限名+角色名对应的权限状态
export type PermissionRow = { permissionDescription: string } & { [roleName: string]: boolean }
