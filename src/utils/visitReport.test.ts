/**
 * FilePath    : blog-client\src\utils\visitReport.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : visitReport 的单元测试
 */

import { describe, expect, it } from "vitest"

import { VISIT_REPORT_DEBOUNCE_MS, createVisitReportDeduper, isVisitReportPath, normalizeVisitReportPath } from "./visitReport"

describe("isVisitReportPath 的测试", () => {
    it.each([
        ["/", true],
        ["/p/1234567890", true],
        ["/category/tech", true],
        ["/tag/golang", true],
        ["/year/2026", true],
        ["/s/keyword", true],
        ["/page/about", true],
        ["/link-list", true],
        ["/user/jiaopengzi", true],
    ])("白名单路径 %s 应上报", (path, want) => {
        expect(isVisitReportPath(path)).toBe(want)
    })

    it.each([["/admin/dashboard"], ["/login"], ["/register"], ["/not-found"], ["/p"], [""]])("非白名单路径 %s 不应上报", (path) => {
        expect(isVisitReportPath(path)).toBe(false)
    })
})

describe("createVisitReportDeduper 的测试", () => {
    it("同路径在防抖窗口内只上报一次", () => {
        const deduper = createVisitReportDeduper()
        expect(deduper.shouldReport("/p/1", 1000)).toBe(true)
        expect(deduper.shouldReport("/p/1", 1000 + VISIT_REPORT_DEBOUNCE_MS - 1)).toBe(false)
        expect(deduper.shouldReport("/p/1", 1000 + VISIT_REPORT_DEBOUNCE_MS)).toBe(true)
    })

    it("不同路径互不防抖", () => {
        const deduper = createVisitReportDeduper()
        expect(deduper.shouldReport("/p/1", 1000)).toBe(true)
        expect(deduper.shouldReport("/p/2", 1000)).toBe(true)
    })

    it("防抖窗口过后切回原路径可再次上报", () => {
        const deduper = createVisitReportDeduper()
        expect(deduper.shouldReport("/p/1", 1000)).toBe(true)
        expect(deduper.shouldReport("/p/2", 2000)).toBe(true)
        // 距 /p/1 上次上报已超过窗口, 切回应重新上报
        expect(deduper.shouldReport("/p/1", 1000 + VISIT_REPORT_DEBOUNCE_MS + 1)).toBe(true)
    })
})

describe("normalizeVisitReportPath 的测试 (bugfix 260918-03)", () => {
    it.each([
        ["/", "/"],
        ["/p/1234567890", "/p/1234567890"],
        ["/year/2026/month/08", "/year/2026/month/08"],
        ["/link-list", "/link-list"],
        ["/user/jiaopengzi", "/user/jiaopengzi"],
    ])("URL 安全字符路径 %s 原样不变", (path, want) => {
        expect(normalizeVisitReportPath(path)).toBe(want)
    })

    it("单层编码路径保持单层不二次编码", () => {
        expect(normalizeVisitReportPath("/tag/%E5%88%86%E8%AF%8D")).toBe("/tag/%E5%88%86%E8%AF%8D")
    })

    it("多层编码路径归一到单层 (生产日志实测形态)", () => {
        // Baiduspider 访问 "实发工资" 标签 4 层编码 URL 的上报形态
        expect(
            normalizeVisitReportPath("/tag/%252525E5%252525AE%2525259E%252525E5%2525258F%25252591%252525E5%252525B7%252525A5%252525E8%252525B5%25252584"),
        ).toBe("/tag/%E5%AE%9E%E5%8F%91%E5%B7%A5%E8%B5%84")
        // Tabular+Editor 380 层极端形态
        let layered = "Tabular+Editor"
        for (let i = 0; i < 380; i++) {
            layered = encodeURIComponent(layered)
        }
        expect(normalizeVisitReportPath(`/tag/${layered}`)).toBe("/tag/Tabular%2BEditor")
    })

    it("同一页面的多层与单层形态归并到相同路径 (PV 不分散)", () => {
        const single = normalizeVisitReportPath("/tag/%E5%AE%9E%E5%8F%91%E5%B7%A5%E8%B5%84")
        const quadruple = normalizeVisitReportPath(
            "/tag/%252525E5%252525AE%2525259E%252525E5%2525258F%25252591%252525E5%252525B7%252525A5%252525E8%252525B5%25252584",
        )
        expect(single).toBe(quadruple)
    })
})
