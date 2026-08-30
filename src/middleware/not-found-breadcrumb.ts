/*
 * FilePath    : blog-client-nuxt\src\middleware\not-found-breadcrumb.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 站内 404 页面包屑(路由中间件, 在布局渲染前就位)
 */

/*
 * 补充说明:
 * 与 user-breadcrumb.ts 同源问题: 面包屑由布局内的 JBreadcrumb 渲染, 布局子树先于页面
 * setup 渲染, 页面 setup 内调 updateItems 时服务端 HTML 已定型(动态项 0 个),
 * 客户端水合时 payload 恢复为 1 项 → hydration mismatch.
 * 改为在渲染前的路由中间件内就位, 服务端 HTML 直出 "404" 面包屑项, 双端一致.
 */

import { useBreadcrumbStore } from "@/stores/breadcrumb"

export default defineNuxtRouteMiddleware(() => {
    useBreadcrumbStore().updateItems("404", "/not-found")
})
