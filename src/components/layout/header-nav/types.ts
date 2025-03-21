/*
 * FilePath    : blog-client\src\components\layout\header-nav\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 头部导航类型定义
 */

import type { MenuItemMap, MenuItemMapWithIndex } from "@/components/common/recursive-menu-item"
import { RouteNamesAdmin } from "@/router"

// admin管理后台菜单项映射表
export type AdminMenuItemMap = MenuItemMap<RouteNamesAdmin>

// admin管理后台菜单项映射表 包含 index 属性
export type AdminMenuItemMapWithIndex = MenuItemMapWithIndex<RouteNamesAdmin>
