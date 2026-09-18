/**
 * FilePath    : blog-client\src\utils\visitReport.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 站点访问上报(PV/UV)工具: 内容页白名单、同路径防抖与路径归一 (bugfix 260918-03)
 */

/**
 * 补充说明:
 * 白名单规则与后端 service/visit.go 的 visitReportPathPrefixes 保持同一份语义,
 * 前端过滤减少无效请求, 后端再做双保险校验
 */

import { encodeSlugOnce } from "@/utils/slug"

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

/**
 * normalizeVisitReportPath 将访问路径的每一段归一到单层 URL 编码形态.
 * @remarks bugfix 260918-03(补充): canonical 双重编码时期被搜索引擎收录的多层编码 URL,
 * 部署修复后仍会被渲染爬虫零星访问(索引存量消退以天/周计), 原样上报会把同一页面的
 * 任意层数形态当作不同 path 分散 PV, 后端日志亦持续出现多层巨串;
 * 归一后同一页面归并到同一规范 path 计数, 统计更准, 日志回归单层.
 * @param path - 路由路径 (vue-router raw 编码形态, 不含 query 与 hash).
 * @returns 各路径段归一后的路径; URL 安全字符路径 (纯数字 id/年月/静态段) 原样不变.
 */
export function normalizeVisitReportPath(path: string): string {
    return path
        .split("/")
        .map((segment) => (segment === "" ? segment : encodeSlugOnce(segment)))
        .join("/")
}
