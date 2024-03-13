/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-23 11:45:46
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-13 15:26:00
 * @FilePath     : \blog-client\src\router\routeAll.ts
 * @Description  : 所有路由配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import type { RouteRecordRaw } from 'vue-router'
import { userRoutes } from '@/router/routeUser'
import { adminRoutes } from '@/router/routeAdmin'
import { navigationRoutes } from '@/router/routeNavigation'

export const routeObj = {
  home: {
    path: '/',
    name: 'home',
    component: () => import('@/views/home'),
    meta: {
      requiresAuth: false,
    },
  },
  test: {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test'),
    meta: {
      requiresAuth: false,
    },
  },
  // 用户相关路由
  ...userRoutes,
  // 导航相关路由
  ...navigationRoutes,
  // 管理员相关路由
  ...adminRoutes(),
}

export const routes = Object.values(routeObj) as RouteRecordRaw[]
