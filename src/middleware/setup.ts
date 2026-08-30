/*
 * FilePath    : blog-client-nuxt\src\middleware\setup.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /setup 路由守卫 (复刻 SPA setupMiddleware: 已初始化时访问设置页重定向 404)
 */

/*
 * 补充说明:
 * /setup 为纯 CSR (routeRules ssr:false), 本中间件仅在客户端执行;
 * 项目未初始化 (SetupNotCompleted) 时放行展示数据库配置表单
 */

import { isSetupAPI } from "@/api/setting/isSetup"
import { ResponseCode } from "@/api/response"

export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path !== "/setup") {
        return
    }

    // 对齐 SPA: 数据库已安装时访问设置页 → 重定向 404 页面 (/not-found)
    const res = await isSetupAPI()
    if (res.data.code === ResponseCode.SetupAlready) {
        return navigateTo("/not-found", { replace: true })
    }
})
