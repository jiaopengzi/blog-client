/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-24 19:43:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-13 16:04:26
 * @FilePath     : \blog-client\src\router\routeAdmin.ts
 * @Description  : admin 路由配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import { adminMenuItemMapWithIndex, AadminSideMenu } from '@/views/admin/component/aside'
import { hasPermission, PermissionNames } from '@/utils/permissionRole'

export const adminRoutes = () => {
  const adminRoutes = [
    {
      path: '/admin',
      name: 'admin',
      component: async () => {
        // 检查用户是否有 LoginAdmin 权限
        if (await hasPermission(PermissionNames.LoginAdmin)) {
          return import('@/views/admin')
        } else {
          return import('@/views/404')
        }
      },
      meta: {
        requiresAuth: true,
      },
    },
  ]

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

  return adminRoutes
}
