/*
 * FilePath    : blog-client-nuxt\src\utils\visitReport.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 站点访问上报(PV/UV)工具: 内容页白名单与同路径防抖
 */

/*
 * 补充说明:
 * 白名单规则与后端 service/visit.go 的 visitReportPathPrefixes 保持同一份语义,
 * 前端过滤减少无效请求, 后端再做双保险校验
 */

// PV 采集白名单前缀: 命中前缀或全等 "/" 才上报
export const VISIT_REPORT_PATH_PREFIXES = ["/p/", "/category/", "/tag/", "/year/", "/s/", "/page/", "/link-list", "/user/"] as const

// 同一路径防抖窗口(毫秒): SPA 来回切换 5 秒内不重复上报
export const VISIT_REPORT_DEBOUNCE_MS = 5000

/**
 * isVisitReportPath 判断页面路径是否在 PV 采集白名单内.
 * @param path - 路由路径.
 * @returns true 表示需要上报.
 */
export function isVisitReportPath(path: string): boolean {
    if (path === "/") {
        return true
    }

    return VISIT_REPORT_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))
}

/**
 * createVisitReportDeduper 创建同路径防抖器.
 * 时间戳由调用方注入, 便于单测; 返回的 shouldReport 判定通过后自动记录本次时间.
 * @returns 含 shouldReport(path, now) 的防抖器.
 */
export function createVisitReportDeduper() {
    let lastPath = ""
    let lastTime = 0

    /**
     * shouldReport 判断该路径此刻是否应上报(同路径 5 秒内只报一次).
     * @param path - 路由路径.
     * @param now - 当前时间戳(毫秒).
     * @returns true 表示应上报.
     */
    function shouldReport(path: string, now: number): boolean {
        if (path === lastPath && now - lastTime < VISIT_REPORT_DEBOUNCE_MS) {
            return false
        }

        lastPath = path
        lastTime = now
        return true
    }

    return { shouldReport }
}
