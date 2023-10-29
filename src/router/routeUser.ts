/**
 * @Author       : jiaopengzi
 * @Date         : 2023-10-23 12:02:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-29 22:17:59
 * @FilePath     : \blog-client\src\router\routeUser.ts
 * @Description  : 用户相关路由
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

// 路由配置
export const userRoutes = {
  login: {
    path: '/login',
    name: 'login',
    component: () => import('@/components/common/LoginPage.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  socialQQLoginCallback: {
    path: '/social/qq/login/callback',
    name: 'socialQQLoginCallback',
    component: () => import('@/components/common/SocialLoginCallback.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  socialQQBindCallback: {
    path: '/social/qq/bind/callback',
    name: 'socialQQBindCallback',
    component: () => import('@/components/common/SocialLoginCallback.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  sociaWeChatLoginCallback: {
    path: '/social/wechat/login/callback',
    name: 'sociaWeChatLoginCallback',
    component: () => import('@/components/common/SocialLoginCallback.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  socialWeChatBindCallback: {
    path: '/social/wechat/bind/callback',
    name: 'socialWeChatBindCallback',
    component: () => import('@/components/common/SocialLoginCallback.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  register: {
    path: '/register',
    name: 'register',
    component: () => import('@/components/common/RegisterPage.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  resetPassword: {
    path: '/reset-password',
    name: 'resetPassword',
    component: () => import('@/components/common/ResetPassword.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  userInfo: {
    path: '/userinfo',
    name: 'userinfo',
    component: () => import('@/views/UserInfoView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
}
