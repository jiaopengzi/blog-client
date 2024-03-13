/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-04 18:07:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-13 16:17:02
 * @FilePath     : \blog-client\src\router\index.ts
 * @Description  : 路由配置
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { createRouter, createWebHistory } from 'vue-router'
import { routeObj, routes } from '@/router/routeAll'
import { ShowMsgTip } from '@/utils/message'
import { MsgType } from '@/components/common'
import { useUserStore } from '@/stores/user'

// 定义路由元信息
// export interface RouteMeta {
//   requiresAuth: boolean // 是否需要登录
//   permissionRequired?: PermissionNames // 将 permissionRequired 设置为可选
// }

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
    next({ path: routeObj.login.path, query: { redirect: to.path } }) // 重定向到登录页带上当前页面路径参数
    // sessionStorage.setItem('redirectRoute', JSON.stringify(to)) // 保存重定向路由
    // next(routeObj.login.path)
  }
  // 如果已经登录，未绑定邮箱，且访问的页面不是用户信息页面，则跳转到用户信息页面
  else if (userStore.isLogin && !userStore.isBindEmail && to.path !== routeObj.userInfo.path) {
    await userStore.changeShowDialogBindEmail(true)
    ShowMsgTip(MsgType.warning, '请绑定邮箱！', 3000)
    next(routeObj.userInfo.path)
  }
  // 如果已经登录，且访问的页面是登录页，则跳转到首页
  else if (to.path === routeObj.login.path && userStore.isLogin) {
    const redirectPath = to.query.redirect as string | undefined
    next(redirectPath ? redirectPath : routeObj.home.path)
  } else {
    next()
  }
})

export default router
