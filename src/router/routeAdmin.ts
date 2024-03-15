/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-24 19:43:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-15 12:10:12
 * @FilePath     : \blog-client\src\router\routeAdmin.ts
 * @Description  : admin 路由配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import { adminMenuItemMapWithIndex, AadminSideMenu } from '@/views/admin/component/aside'

export const adminRoutes = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin'),
    meta: {
      requiresAuth: true,
    },
  },
]

// 循环生成侧边栏路由
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
  adminRoutes.push(route)
})
