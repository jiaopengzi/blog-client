/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-24 19:43:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-15 20:08:50
 * @FilePath     : \blog-client\src\router\routeAdmin.ts
 * @Description  : admin 路由配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import type { RouteRecordRaw } from 'vue-router'
import { adminMenuItemMapWithIndex, AadminSideMenu } from '@/views/admin/component/aside'

// 生成管理后台路由
function generateAdminRoutes() {
  const routes: { [key: string]: RouteRecordRaw } = {
    admin: {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin'),
      meta: {
        requiresAuth: true,
      },
    },
  }
  // 生成管理后台路由
  Object.keys(adminMenuItemMapWithIndex).forEach((key) => {
    const menuItem = adminMenuItemMapWithIndex[key as AadminSideMenu]
    const route = {
      path: menuItem.index,
      name: key,
      component: () => import('@/views/admin'),
      meta: {
        requiresAuth: true,
      },
    }
    routes[key] = route
  })

  return routes
}

export const adminRoutes = generateAdminRoutes()
