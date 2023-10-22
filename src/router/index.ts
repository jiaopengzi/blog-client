/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-04 18:07:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-22 12:21:47
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
  socialLoginCallbackComponent,
  registerComponent,
} from '@/components/common/index'
import { ShowMsgTip } from '@/utils/Message'
import { MsgType } from '@/components/common/index'
import { useUserStore } from '@/stores/user'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: loginComponent,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/social/qq/callback',
      name: 'social-qq-callback',
      component: socialLoginCallbackComponent,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/social/qq/bind/callback',
      name: 'social-qq-bind-callback',
      component: socialLoginCallbackComponent,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/social/wechat/callback',
      name: 'social-wechat-callback',
      component: socialLoginCallbackComponent,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: registerComponent,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: resetPasswordComponent,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/user-info',
      name: 'user-info',
      component: UserInfoView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  await userStore.getUserInfoByToken(true)

  // 如果用户没有登录，且访问的页面需要登录，则跳转到登录页
  if (to.meta.requiresAuth && !userStore.isLogin) {
    next('/login')
  }
  // 如果已经登录，未绑定邮箱，且访问的页面不是用户信息页面，则跳转到用户信息页面
  else if (userStore.isLogin && !userStore.isBindEmail && to.path !== '/user-info') {
    await userStore.changeShowDialogBindEmail(true)
    ShowMsgTip(MsgType.warning, '请绑定邮箱！', 3000)
    next('/user-info')
  }
  // 如果已经登录，且访问的页面是登录页，则跳转到首页
  else if (to.path === '/login' && userStore.isLogin) {
    next('/') // 重定向到首页
  } else {
    next()
  }
})

export default router
