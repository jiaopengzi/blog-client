/**
 * @FilePath     : \blog-client\src\router\middleware\auth.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 认证中间件
 */
import { type RouteLocationNormalized } from "vue-router"

import { initStores } from "@/stores/init"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

import { RouteNames } from "../types"

/**
 * 认证中间件 如果用户没有登录，且访问的页面需要登录，则跳转到登录页；
 * 如果已经登录，未绑定邮箱，且访问的页面不是用户信息页面，则跳转到用户信息页面；
 * 如果已经登录，且访问的页面是登录页，则跳转到首页
 *
 * @param to - 即将进入的路由对象
 * @returns 如果用户没有登录，且访问的页面需要登录，则返回登录页路径；
 */
export const authMiddleware = async (to: RouteLocationNormalized) => {
    await initStores() // 初始化所有 store
    const userStore = useUserStore()

    // 如果用户没有登录，且访问的页面需要登录，则跳转到登录页
    if (to.meta.requiresAuth && !userStore.isLogin) {
        return { name: RouteNames.Login, query: { redirect: to.fullPath } } // 重定向到登录页带上当前页面路径参数
    }

    // 如果已经登录，未绑定邮箱，且访问的页面不是用户信息页面，则跳转到用户信息页面
    else if (userStore.isLogin && !userStore.isBindEmail && to.name !== RouteNames.UserInfo) {
        await userStore.changeShowDialogBindEmail(true)
        MessageUtil.warning("请绑定邮箱！", 6000)
        return { name: RouteNames.UserInfo }
    }

    // 如果已经登录，且访问的页面是登录页，则跳转到首页
    else if (to.name === RouteNames.Login && userStore.isLogin) {
        const redirectPath = to.query.redirect as string | undefined
        return redirectPath ? redirectPath : { name: RouteNames.Home }
    }

    // 其他情况
    return true
}
