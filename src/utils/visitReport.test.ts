/*
 * FilePath    : blog-client-nuxt\src\utils\visitReport.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : visitReport 的单元测试
 */

import { describe, expect, it } from "vitest"

import { VISIT_REPORT_DEBOUNCE_MS, createVisitReportDeduper, isVisitReportPath } from "./visitReport"

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
