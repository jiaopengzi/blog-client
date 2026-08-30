/*
 * FilePath    : blog-client-nuxt\src\middleware\admin.global.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : admin 区路由守卫 (复刻 SPA authMiddleware 的 admin 语义)
 */

/*
 * 补充说明:
 * 1) /admin → /admin/dashboard (与 routeAdmin redirect 一致)
 * 2) 未知 admin 子路径 (不在菜单映射) → 重定向站内 404 (/not-found, 登录与否一致)
 * 3) 未登录访问有效 /admin/** → /login?redirect=<fullPath>
 * admin 整区 ssr:false; userStore 在客户端分支内动态加载,
 * 避免其依赖链 (stores/api) 进入 SSR 入口
 * bugfix(260824 bug01): initStores 已改为水合完成后 (onNuxtReady) 执行,
 * 守卫在检查 isLogin 前需等待共享初始化完成
 */

export default defineNuxtRouteMiddleware(async (to) => {
    if (!to.path.startsWith("/admin")) {
        return
    }

    // 1) 根路径重定向到默认子路由 (与 SPA routeAdmin 的 redirect 一致)
    if (to.path === "/admin") {
        return navigateTo("/admin/dashboard", { replace: true })
    }

    // 2) 未知 admin 子路径 (不在菜单映射表内) → 重定向到站内 404 页 (/not-found, 展示与全局
    //    错误页一致: header+面包屑+倒计时); 登录与否都直接 404 (业务常识: 路径不存在与登录态
    //    无关, 未登录访问坏路径不应被带去登录页); 用重定向而非置 fatal 错误状态: admin 整区
    //    ssr:false, 直链进入时错误发生在客户端初始化阶段, 会触发 NUXT_E1005 dev 告警;
    //    重定向则路由不激活, 也避免 admin.vue 条件渲染 NuxtPage 引发的 NUXT_E4016 告警
    //    动态导入菜单映射 (纯数据模块 utils), 避免其进入全局中间件的公共 chunk
    const { adminMenuItemMapWithIndexMap } = await import("@/components/views/admin/component/aside/utils")
    if (!adminMenuItemMapWithIndexMap[to.path]) {
        return navigateTo("/not-found", { replace: true })
    }

    // 3) 登录守卫 (客户端): 未登录跳登录页并携带回跳地址 (与 SPA authMiddleware 一致)
    if (import.meta.client) {
        const { getInitStoresPromise } = await import("@/stores/init")
        await getInitStoresPromise()

        const { useUserStore } = await import("@/stores/user")
        const userStore = useUserStore()
        if (!userStore.isLogin) {
            return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
        }
    }
})
