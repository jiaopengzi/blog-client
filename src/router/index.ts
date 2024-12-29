/**
 * @Author       : jiaopengzi
 * @Date         : 2023-07-04 18:07:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-05 10:01:30
 * @FilePath     : \blog-client\src\router\index.ts
 * @Description  : 路由配置
 * @blog         : https://jiaopengzi.com
 * @Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { createRouter, createWebHistory } from "vue-router"
import { routeObj, routes } from "@/router/routeAll"
import { MessageUtil } from "@/utils/message"
import { useUserStore } from "@/stores/user"
import { AdminSideMenu } from "@/views/admin/component/aside"
import { confirmCommon } from "@/utils/confirm"

// 创建路由实例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // 使用history路由模式
    routes, // 路由配置
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    await userStore.getUserInfoByToken() // 获取用户信息

    // 如果用户没有登录，且访问的页面需要登录，则跳转到登录页
    if (to.meta.requiresAuth && !userStore.isLogin) {
        next({ path: routeObj.login.path, query: { redirect: to.fullPath } }) // 重定向到登录页带上当前页面路径参数
    }

    // 如果已经登录，未绑定邮箱，且访问的页面不是用户信息页面，则跳转到用户信息页面
    else if (userStore.isLogin && !userStore.isBindEmail && to.path !== routeObj.userInfo.path) {
        await userStore.changeShowDialogBindEmail(true)
        MessageUtil.warning("请绑定邮箱！", 3000)
        next(routeObj.userInfo.path)
    }

    // 如果已经登录，且访问的页面是登录页，则跳转到首页
    else if (to.path === routeObj.login.path && userStore.isLogin) {
        const redirectPath = to.query.redirect as string | undefined
        next(redirectPath ? redirectPath : routeObj.home.path)
    }

    // 如果用户正在编辑，跳转到其他页面时，提示是否离开编辑页面
    else if (userStore.isEditing && to.path !== routeObj[AdminSideMenu.PostWrite].path) {
        // 提示是否离开编辑页面
        await confirmCommon(
            "确认离开当前未保存编辑页面吗？",
            () => {
                console.log("确认")
                userStore.setIsEditing(false)
                next()
            },
            () => {
                console.log("取消")
                // 点击取消，不离开当前页面
                next(false)
            },
        )
    }

    // 其他情况
    else {
        next()
    }
})

export default router
