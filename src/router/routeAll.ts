/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-23 11:45:46
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-15 11:06:07
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
  ...adminRoutes,

  404: {
    path: '/:pathMatch(.*)*', // 当匹配不到路由时，跳转到404页面
    name: '404',
    component: () => import('@/views/404'),
    meta: {
      requiresAuth: false,
    },
  },
}

export const routes = Object.values(routeObj) as RouteRecordRaw[]
