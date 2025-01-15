/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 11:52:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-15 12:30:33
 * @FilePath     : \blog-client\src\views\admin\component\aside\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { MenuItemMap, MenuItemMapWithIndex } from "@/components/common/recursive-menu-item"
import { RouteNamesAdmin } from "@/router"

// admin管理后台菜单项映射表
export type AdminMenuItemMap = MenuItemMap<RouteNamesAdmin>

// admin管理后台菜单项映射表 包含 index 属性
export type AdminMenuItemMapWithIndex = MenuItemMapWithIndex<RouteNamesAdmin>
