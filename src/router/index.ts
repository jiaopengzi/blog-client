/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-04 18:07:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-14 14:48:37
 * @FilePath     : \blog-client\src\router\index.ts
 * @Description  : 路由配置
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UserInfoView from '@/views/UserInfoView.vue'
import {
  resetPasswordComponent,
  loginComponent,
  registerComponent,
} from '@/components/common/index'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: loginComponent,
    },
    {
      path: '/register',
      name: 'register',
      component: registerComponent,
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: resetPasswordComponent,
    },
    {
      path: '/user-info',
      name: 'user-info',
      component: UserInfoView,
    },
  ],
})

export default router
