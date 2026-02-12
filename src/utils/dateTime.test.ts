/**
 * @FilePath     : \blog-client\src\utils\dateTime.test.ts
 * @Description  : formatLocalISO 工具函数测试
 */

import { describe, expect, it } from "vitest"

import { formatLocalISO } from "@/utils/dateTime"

describe("formatLocalISO", () => {
    it("格式化日期包含年月日时分秒和时区偏移", () => {
        // 2026-01-15 08:30:45 本地时间
        const date = new Date(2026, 0, 15, 8, 30, 45, 0)
        const result = formatLocalISO(date)

        // 验证日期部分
        expect(result).toContain("2026-01-15")
        // 验证时间部分
        expect(result).toContain("T08:30:45")
        // 验证有时区偏移(+ 或 -)
        expect(result).toMatch(/[+-]\d{2}:\d{2}$/)
    })

    it("月份和日期补零", () => {
        const date = new Date(2026, 1, 3, 5, 6, 7) // 2月3日
        const result = formatLocalISO(date)
        expect(result).toContain("2026-02-03")
        expect(result).toContain("T05:06:07")
    })

    it("午夜时间", () => {
        const date = new Date(2026, 5, 1, 0, 0, 0)
        const result = formatLocalISO(date)
        expect(result).toContain("T00:00:00")
    })

    it("23:59:59 结束时间", () => {
        const date = new Date(2026, 5, 1, 23, 59, 59)
        const result = formatLocalISO(date)
        expect(result).toContain("T23:59:59")
    })

    it("12月31日", () => {
        const date = new Date(2026, 11, 31, 12, 0, 0)
        const result = formatLocalISO(date)
        expect(result).toContain("2026-12-31")
    })

    it("返回字符串可以被 new Date() 解析回来", () => {
        const original = new Date(2026, 3, 15, 14, 30, 0)
        const str = formatLocalISO(original)
        const parsed = new Date(str)
        // 时间戳一致(忽略毫秒)
        expect(Math.abs(parsed.getTime() - original.getTime())).toBeLessThan(1000)
    })
})
