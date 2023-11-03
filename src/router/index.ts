/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-04 18:07:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-27 10:20:28
 * @FilePath     : \blog-client\src\router\index.ts
 * @Description  : 路由配置
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { createRouter, createWebHistory } from 'vue-router'
import { routeObj, routes } from '@/router/routeAll'
import { ShowMsgTip } from '@/utils/message'
import { MsgType } from '@/components/common/index'
import { useUserStore } from '@/stores/user'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  await userStore.getUserInfoByToken()

  // 如果用户没有登录，且访问的页面需要登录，则跳转到登录页
  if (to.meta.requiresAuth && !userStore.isLogin) {
    next(routeObj.login.path)
  }
  // 如果已经登录，未绑定邮箱，且访问的页面不是用户信息页面，则跳转到用户信息页面
  else if (userStore.isLogin && !userStore.isBindEmail && to.path !== routeObj.userInfo.path) {
    await userStore.changeShowDialogBindEmail(true)
    ShowMsgTip(MsgType.warning, '请绑定邮箱！', 3000)
    next(routeObj.userInfo.path)
  }
  // 如果已经登录，且访问的页面是登录页，则跳转到首页
  else if (to.path === routeObj.login.path && userStore.isLogin) {
    next(routeObj.home.path) // 重定向到首页
  } else {
    next()
  }
})

export default router
