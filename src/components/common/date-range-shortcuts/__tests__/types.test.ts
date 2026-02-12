/**
 * @FilePath     : \blog-client\src\components\common\date-range-shortcuts\__tests__\types.test.ts
 * @Description  : defaultShortcuts 快捷选项测试
 */

import { describe, expect, it, beforeEach, afterEach, vi } from "vitest"

import { defaultShortcuts } from "../types"

describe("defaultShortcuts", () => {
    // 固定当前时间为 2026-02-12 14:30:00
    const NOW = new Date(2026, 1, 12, 14, 30, 0, 0)

    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(NOW)
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("包含 7 个快捷选项", () => {
        expect(defaultShortcuts).toHaveLength(7)
    })

    it("所有选项都有 label 和 getRange", () => {
        for (const item of defaultShortcuts) {
            expect(item.label).toBeTruthy()
            expect(typeof item.getRange).toBe("function")
        }
    })

    it("所有 getRange 返回 [Date, Date], 且 start <= end", () => {
        for (const item of defaultShortcuts) {
            const [start, end] = item.getRange()
            expect(start).toBeInstanceOf(Date)
            expect(end).toBeInstanceOf(Date)
            expect(start.getTime()).toBeLessThanOrEqual(end.getTime())
        }
    })

    it("今天: 当天 00:00:00 ~ 当前时刻", () => {
        const item = defaultShortcuts.find((s) => s.label === "今天")!
        const [start, end] = item.getRange()
        expect(start.getFullYear()).toBe(2026)
        expect(start.getMonth()).toBe(1)
        expect(start.getDate()).toBe(12)
        expect(start.getHours()).toBe(0)
        expect(start.getMinutes()).toBe(0)
        expect(start.getSeconds()).toBe(0)
        expect(end.getDate()).toBe(12)
        expect(end.getHours()).toBe(14)
        expect(end.getMinutes()).toBe(30)
        expect(end.getSeconds()).toBe(0)
    })

    it("近7天: 7天前 00:00:00 ~ 当前时刻", () => {
        const item = defaultShortcuts.find((s) => s.label === "近7天")!
        const [start, end] = item.getRange()
        // 2026-02-12 - 6 = 2026-02-06
        expect(start.getDate()).toBe(6)
        expect(start.getMonth()).toBe(1)
        expect(start.getHours()).toBe(0)
        expect(end.getDate()).toBe(12)
        expect(end.getHours()).toBe(14)
    })

    it("近30天: 30天前 00:00:00 ~ 当前时刻", () => {
        const item = defaultShortcuts.find((s) => s.label === "近30天")!
        const [start, end] = item.getRange()
        // 2026-02-12 - 29 = 2026-01-14
        expect(start.getDate()).toBe(14)
        expect(start.getMonth()).toBe(0) // January
        expect(end.getDate()).toBe(12)
        expect(end.getHours()).toBe(14)
    })

    it("本周: 本周一 00:00:00 ~ 本周日 23:59:59", () => {
        const item = defaultShortcuts.find((s) => s.label === "本周")!
        const [start, end] = item.getRange()
        // 2026-02-12 是周四, 本周一是 02-09
        expect(start.getDay()).toBe(1) // Monday
        expect(start.getDate()).toBe(9)
        expect(start.getHours()).toBe(0)
        expect(end.getDate()).toBe(15)
        expect(end.getHours()).toBe(23)
    })

    it("本月: 本月1号 00:00:00 ~ 本月最后一天 23:59:59", () => {
        const item = defaultShortcuts.find((s) => s.label === "本月")!
        const [start, end] = item.getRange()
        expect(start.getDate()).toBe(1)
        expect(start.getMonth()).toBe(1)
        expect(start.getHours()).toBe(0)
        expect(end.getDate()).toBe(28)
        expect(end.getHours()).toBe(23)
    })

    it("本季度: 本季度第一天 00:00:00 ~ 本季度最后一天 23:59:59", () => {
        const item = defaultShortcuts.find((s) => s.label === "本季度")!
        const [start, end] = item.getRange()
        // 2月属于 Q1(0-2), 所以起始是 1月1日
        expect(start.getMonth()).toBe(0) // January
        expect(start.getDate()).toBe(1)
        expect(end.getMonth()).toBe(2) // March
        expect(end.getDate()).toBe(31)
    })

    it("今年: 1月1日 00:00:00 ~ 12月31日 23:59:59", () => {
        const item = defaultShortcuts.find((s) => s.label === "今年")!
        const [start, end] = item.getRange()
        expect(start.getFullYear()).toBe(2026)
        expect(start.getMonth()).toBe(0)
        expect(start.getDate()).toBe(1)
        expect(start.getHours()).toBe(0)
        expect(end.getMonth()).toBe(11)
        expect(end.getDate()).toBe(31)
        expect(end.getHours()).toBe(23)
    })
})
