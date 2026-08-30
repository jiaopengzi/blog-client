/*
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\permission-role\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 权限角色类型定义
 */

import { type UpsertPermissionRoleRequest } from "@/api/permissionRole/upsertPermissionRole"
import { PermissionNames } from "@/api/permissionRole/permissionNames"

export interface Role {
    role_name: string // 角色名称
    permission_names: PermissionNames[] // 权限名称数组
    description: string // 角色描述
    allSelected?: boolean // 是否全选, 可选属性
}

// 权限名+角色名对应的权限状态
export type PermissionRow = {
    permissionIndex: number
    permissionName: PermissionNames
    permissionDescription: string
} & {
    [roleName: string]: boolean
}

export enum LimitCount {
    不限制 = 0,
    "10次" = 10,
    "50次" = 50,
    "100次" = 100,
    "500次" = 500,
    "1000次" = 1000,
}

export enum LimitPeriod {
    不限制 = 0,
    "10Min" = 600, // 10分钟
    "1H" = 3600, // 1小时
    "1D" = 86400, // 1天
    "1W" = 604800, // 1周
    "1M" = 2592000, // 1月
    "1Y" = 31536000, // 1年
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PermissionRole extends UpsertPermissionRoleRequest {}
