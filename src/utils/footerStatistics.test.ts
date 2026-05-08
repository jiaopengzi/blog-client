/**
 * FilePath    : blog-client\src\utils\footerStatistics.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 公开页统计脚本挂载器单元测试
 */

import { afterEach, describe, expect, it } from "vitest"

import {
    blockFooterStatisticsForPath,
    disableFooterStatisticsScript,
    extractGoogleAnalyticsMeasurementIds,
    syncFooterStatisticsScriptForPath,
} from "./footerStatistics"

interface AnalyticsWindow extends Window {
    [key: string]: unknown
}

describe("footerStatistics", () => {
    afterEach(() => {
        document.body.innerHTML = ""
        resetAnalyticsWindowProperty("ga-disable-G-RVHJ5XT98W")
        resetAnalyticsWindowProperty("dataLayer")
        resetAnalyticsWindowProperty("gtag")
        resetAnalyticsWindowProperty("_hmt")
        resetAnalyticsWindowProperty("__footerStatisticsCounter")
    })

    it("提取统计脚本中的 Google Analytics measurement id", () => {
        const script = `
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-RVHJ5XT98W"></script>
            <script>
                gtag("config", "G-RVHJ5XT98W")
                gtag("config", "G-SECOND123")
            </script>
        `

        expect(extractGoogleAnalyticsMeasurementIds(script)).toEqual(["G-RVHJ5XT98W", "G-SECOND123"])
    })

    it("进入 admin 前会先禁用 Google Analytics", () => {
        const script = '<script async src="https://www.googletagmanager.com/gtag/js?id=G-RVHJ5XT98W"></script>'

        blockFooterStatisticsForPath(script, "/admin/post-all")

        expect(getAnalyticsWindow()["ga-disable-G-RVHJ5XT98W"]).toBe(true)
    })

    it("进入 admin 后会清理已注入的统计脚本", async () => {
        const script = "<script>window.__footerStatisticsCounter = (window.__footerStatisticsCounter || 0) + 1;</script>"

        await syncFooterStatisticsScriptForPath(script, "/")
        expect(document.querySelectorAll('script[data-footer-statistics-script="true"]')).toHaveLength(1)

        await syncFooterStatisticsScriptForPath(script, "/admin/post-all")
        expect(document.querySelectorAll('script[data-footer-statistics-script="true"]')).toHaveLength(0)
    })

    it("清理不可配置的统计全局变量时不会打断 admin 跳转", () => {
        Object.defineProperty(getAnalyticsWindow(), "_hmt", {
            configurable: false,
            writable: true,
            value: ["existing"],
        })

        const script = "<script>var _hmt = _hmt || [];</script>"

        expect(() => {
            blockFooterStatisticsForPath(script, "/admin/post-all")
        }).not.toThrow()
        expect(getAnalyticsWindow()["_hmt"]).toEqual([])

        resetAnalyticsWindowProperty("_hmt")
    })

    it("禁用统计脚本后仍保留可安全 push 的 dataLayer 和 gtag", () => {
        const script = '<script async src="https://www.googletagmanager.com/gtag/js?id=G-RVHJ5XT98W"></script>'

        disableFooterStatisticsScript(script)

        expect(Array.isArray(getAnalyticsWindow()["dataLayer"])).toBe(true)
        expect(typeof getAnalyticsWindow()["gtag"]).toBe("function")
        expect(() => {
            ;(getAnalyticsWindow()["gtag"] as (...args: unknown[]) => void)("config", "G-RVHJ5XT98W")
        }).not.toThrow()
        expect(getAnalyticsWindow()["dataLayer"]).toEqual([["config", "G-RVHJ5XT98W"]])
    })
})

/**
 * 获取允许动态属性访问的 window 包装对象.
 *
 * @returns 带索引签名的 window 对象.
 */
function getAnalyticsWindow(): AnalyticsWindow {
    return window as unknown as AnalyticsWindow
}

/**
 * 重置测试过程中写入到 window 上的统计相关属性.
 *
 * @param propertyName 需要重置的属性名.
 * @returns void.
 */
function resetAnalyticsWindowProperty(propertyName: string): void {
    const analyticsWindow = getAnalyticsWindow()
    const propertyDescriptor = Object.getOwnPropertyDescriptor(analyticsWindow, propertyName)

    if (!propertyDescriptor) {
        return
    }

    if (propertyDescriptor.configurable) {
        delete analyticsWindow[propertyName]
        return
    }

    if (propertyDescriptor.writable) {
        analyticsWindow[propertyName] = undefined
    }
}
