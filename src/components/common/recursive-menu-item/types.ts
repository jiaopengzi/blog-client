/**
 * @FilePath     : \blog-client\src\components\common\recursive-menu-item\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型定义
 */

import { IconKeys } from "@/components/common/icons"
import { PermissionNames } from "@/utils/permissionRole"

// 菜单项接口定义无需 index 属性
export interface MenuItem {
    display: string // 显示名称
    icon?: {
        name: IconKeys // 图标名称
        class?: string // 图标样式
    }
    parentIndex?: string // 父级菜单索引
    permissionName?: PermissionNames // 权限名称

    // 参数
    params?: {
        [key: string]: unknown
    }

    components?: string // 可选组件名称
}

// 菜单项接口定义需要 index 属性
export interface MenuItemWithIndex extends MenuItem {
    index: string // 菜单索引
}

// 菜单项映射表 无需 index 属性
export type MenuItemMap<T extends string> = {
    [key in T]: MenuItem
}

// 菜单项映射表 需要 index 属性
export type MenuItemMapWithIndex<T extends string> = {
    [key in T]: MenuItemWithIndex
}
