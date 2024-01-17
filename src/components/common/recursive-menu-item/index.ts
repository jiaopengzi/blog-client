/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-17 20:28:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-17 20:31:37
 * @FilePath     : \blog-client\src\components\common\recursive-menu-item\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { IconKeys } from '@/components/common/icons'

// 菜单项接口定义
export interface MenuItem {
  index: string
  display: string
  icon?: {
    name: IconKeys
    class?: string
  }
  parentIndex?: string
}

// 菜单项映射表
export interface MenuItemMap {
  [index: string]: MenuItem
}

export { default } from './index.vue'
