/*
 * FilePath    : blog-client-nuxt\src\middleware\user-breadcrumb.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 用户公开主页面包屑(路由中间件, 在布局渲染前就位)
 */

/*
 * 补充说明:
 * 面包屑由布局内的 JBreadcrumb 渲染(layouts/bare-shell.vue), 布局是页面的父级,
 * SSR 时布局子树先于页面 setup 渲染 —— 页面 setup 内再调 updateItems 已经来不及:
 * 服务端 HTML 里面包屑动态项为 0, 而客户端水合时 store 已从 payload 恢复为 1 项,
 * 双端不一致 → hydration mismatch(控制台 "Hydration node mismatch ... expected on client: span").
 * 路由中间件在渲染前执行(服务端与客户端时机一致), 把面包屑在渲染前就位, 服务端即可直出该项,
 * 双端一致且 SEO 可收录完整的面包屑链.
 * 用户名格式校验与页面内一致(非法用户名不写面包屑, 由页面自行跳转 404).
 */

import { useBreadcrumbStore } from "@/stores/breadcrumb"
import { RegexPatterns } from "@/utils/regexPatterns"

export default defineNuxtRouteMiddleware((to) => {
    const username = String(to.params.username ?? "")

    if (RegexPatterns.UserName.test(username)) {
        useBreadcrumbStore().updateItems(username, `/user/${username}`)
    }
})
