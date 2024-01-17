/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-23 11:45:46
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-13 15:36:48
 * @FilePath     : \blog-client\src\router\routeAll.ts
 * @Description  : 所有路由配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import type { RouteRecordRaw } from 'vue-router'
import { userRoutes } from '@/router/routeUser'
import { navigationRoutes } from '@/router/routeNavigation'

// 添加前缀
// function addPrefixToRoutes(routeObj: any, prefix = '/v1') {
//   const result: any = {}
//   for (const key in routeObj) {
//     if (Object.prototype.hasOwnProperty.call(routeObj, key)) {
//       result[key] = {
//         ...routeObj[key],
//         path: prefix + routeObj[key].path,
//       }
//     }
//   }
//   return result
// }

// 路由配置
// export const routeObj: any = addPrefixToRoutes(
//   {
//     home: {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//       meta: {
//         requiresAuth: false,
//       },
//     },
//     // 用户相关路由
//     ...userRoutes,
//     // 导航相关路由
//     ...navigationRoutes,
//   },
//   '/client'
// )

export const routeObj: any = {
  home: {
    path: '/',
    name: 'home',
    component: () => import('@/views/home'),
    meta: {
      requiresAuth: false,
    },
  },
  admin: {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin'),
    meta: {
      requiresAuth: true,
    },
  },
  test: {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test/index.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  // 用户相关路由
  ...userRoutes,
  // 导航相关路由
  ...navigationRoutes,
}

export const routes = Object.values(routeObj) as RouteRecordRaw[]
