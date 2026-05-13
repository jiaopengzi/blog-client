/**
 * @FilePath     : \blog-client\src\utils\dateTime.test.ts
 * @Description  : formatLocalISO 工具函数测试
 */

import { describe, expect, it } from "vitest"

import { displayDurationTime, formatDurationTime, formatLocalISO } from "@/utils/dateTime"

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

describe("displayDurationTime", () => {
    it("0 或负数返回空字符串", () => {
        expect(displayDurationTime(0)).toBe("")
        expect(displayDurationTime(-1)).toBe("")
    })

    it("仅秒", () => {
        expect(displayDurationTime(1)).toBe("1 秒")
        expect(displayDurationTime(30)).toBe("30 秒")
        expect(displayDurationTime(59)).toBe("59 秒")
    })

    it("分钟 + 秒", () => {
        expect(displayDurationTime(60)).toBe("1 分钟")
        expect(displayDurationTime(90)).toBe("1 分钟 30 秒")
        expect(displayDurationTime(3599)).toBe("59 分钟 59 秒")
    })

    it("小时 + 分钟（秒被截断）", () => {
        expect(displayDurationTime(3600)).toBe("1 小时")
        expect(displayDurationTime(3661)).toBe("1 小时 1 分钟")
        expect(displayDurationTime(7200)).toBe("2 小时")
    })

    it("中间单位为零时跳过", () => {
        expect(displayDurationTime(3610)).toBe("1 小时 10 秒")
        expect(displayDurationTime(3601)).toBe("1 小时 1 秒")
        expect(displayDurationTime(86410)).toBe("1 天 10 秒")
    })

    it("天 + 小时", () => {
        expect(displayDurationTime(86400)).toBe("1 天")
        expect(displayDurationTime(90000)).toBe("1 天 1 小时")
        expect(displayDurationTime(172800)).toBe("2 天")
    })

    it("最多展示两个单位", () => {
        expect(displayDurationTime(90061)).toBe("1 天 1 小时")
    })
})

describe("formatDurationTime", () => {
    it("小于 1 分钟显示 mm:ss", () => {
        expect(formatDurationTime(0)).toBe("00:00")
        expect(formatDurationTime(30)).toBe("00:30")
        expect(formatDurationTime(59)).toBe("00:59")
    })

    it("分钟级显示 mm:ss", () => {
        expect(formatDurationTime(60)).toBe("01:00")
        expect(formatDurationTime(3599)).toBe("59:59")
    })

    it("小时级显示 hh:mm:ss", () => {
        expect(formatDurationTime(3600)).toBe("01:00:00")
        expect(formatDurationTime(3661)).toBe("01:01:01")
    })

    it("天级显示 d天 hh:mm:ss", () => {
        expect(formatDurationTime(86400)).toBe("1天 00:00:00")
        expect(formatDurationTime(90000)).toBe("1天 01:00:00")
        expect(formatDurationTime(90061)).toBe("1天 01:01:01")
    })
})
