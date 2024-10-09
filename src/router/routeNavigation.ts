/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-23 15:26:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-15 20:24:49
 * @FilePath     : \blog-client\src\router\routeNavigation.ts
 * @Description  : 导航相关路由
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// 路由配置
export const navigationRoutes = {
  post: {
    path: '/post',
    name: 'post',
    component: () => import('@/views/test'),
    meta: {
      requiresAuth: false
    }
  },
  video: {
    path: '/video',
    name: 'video',
    component: () => import('@/views/test'),
    meta: {
      requiresAuth: false
    }
  },
  doc: {
    path: '/doc',
    name: 'doc',
    component: () => import('@/views/test'),
    meta: {
      requiresAuth: false
    }
  },
  tool: {
    path: '/tool',
    name: 'tool',
    component: () => import('@/views/test'),
    meta: {
      requiresAuth: false
    }
  },
  vip: {
    path: '/vip',
    name: 'vip',
    component: () => import('@/views/test'),
    meta: {
      requiresAuth: false
    }
  }
}
