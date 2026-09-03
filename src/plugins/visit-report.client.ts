/*
 * FilePath    : blog-client-nuxt\src\plugins\visit-report.client.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 站点访问上报插件(PV/UV, 仅客户端)
 */

/*
 * 补充说明:
 * 首屏在 router.isReady 后上报一次, 后续路由切换经 afterEach 上报;
 * 白名单与同路径 5 秒防抖在发送前过滤; 上报失败一律静默, 不影响页面
 */

import { reportVisitAPI } from "@/api/visit/report"
import { createVisitReportDeduper, isVisitReportPath } from "@/utils/visitReport"

export default defineNuxtPlugin((nuxtApp) => {
    // plugin 上下文中经 nuxtApp.$router 取路由实例(vue-router 的 useRouter 仅组件 setup 内可用)
    const router = nuxtApp.$router
    const deduper = createVisitReportDeduper()

    /**
     * report 上报一次页面访问; 上报是尽力而为的统计行为, 网络失败静默忽略.
     * @param path - 路由路径.
     */
    const report = (path: string) => {
        if (!isVisitReportPath(path)) {
            return
        }

        if (!deduper.shouldReport(path, Date.now())) {
            return
        }

        reportVisitAPI({ path }).catch(() => {})
    }

    // 首屏: 客户端水合完成后上报当前路径
    void router.isReady().then(() => {
        report(router.currentRoute.value.path)
    })

    // 后续: 路由切换上报
    router.afterEach((to) => {
        report(to.path)
    })
})
