/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-17 20:28:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-24 17:24:18
 * @FilePath     : \blog-client\src\components\common\recursive-menu-item\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { IconKeys } from '@/components/common/icons'

// 菜单项接口定义无需 index 属性
export interface MenuItem {
  display: string
  icon?: {
    name: IconKeys
    class?: string
  }
  parentIndex?: string
}

// 菜单项接口定义需要 index 属性
export interface MenuItemWithIndex extends MenuItem {
  index: string
}

// 菜单项映射表 无需 index 属性
export type MenuItemMap<T extends string> = {
  [key in T]: MenuItem
}

// 菜单项映射表 需要 index 属性
export type MenuItemMapWithIndex<T extends string> = {
  [key in T]: MenuItemWithIndex
}

export { default } from './index.vue'
