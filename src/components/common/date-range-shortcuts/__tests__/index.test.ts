/**
 * @FilePath     : \blog-client\src\components\common\date-range-shortcuts\__tests__\index.test.ts
 * @Description  : DateRangeShortcuts 组件测试
 */

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { mount } from "@vue/test-utils"
import { nextTick } from "vue"
import ElementPlus from "element-plus"

import DateRangeShortcuts from "../index.vue"
import type { DateShortcut } from "../types"
import { formatLocalISO } from "@/utils/dateTime"

// 固定当前时间
const NOW = new Date(2026, 1, 12, 14, 30, 0, 0)

const mountComponent = (props = {}) => {
    return mount(DateRangeShortcuts, {
        props: {
            start: "",
            end: "",
            ...props,
        },
        global: {
            plugins: [ElementPlus],
        },
    })
}

describe("DateRangeShortcuts 组件", () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(NOW)
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("渲染 7 个默认快捷按钮", () => {
        const wrapper = mountComponent()
        const items = wrapper.findAll(".shortcut-item")
        expect(items).toHaveLength(7)
        expect(items[0].text()).toBe("今天")
        expect(items[6].text()).toBe("今年")
    })

    it("渲染自定义快捷选项", () => {
        const custom: DateShortcut[] = [
            { label: "最近1小时", getRange: () => [new Date(), new Date()] },
            { label: "昨天", getRange: () => [new Date(), new Date()] },
        ]
        const wrapper = mountComponent({ shortcuts: custom })
        const items = wrapper.findAll(".shortcut-item")
        expect(items).toHaveLength(2)
        expect(items[0].text()).toBe("最近1小时")
        expect(items[1].text()).toBe("昨天")
    })

    it("渲染两个日期选择器", () => {
        const wrapper = mountComponent()
        const pickers = wrapper.findAll(".el-date-editor")
        expect(pickers).toHaveLength(2)
    })

    it("渲染开始时间和结束时间标签", () => {
        const wrapper = mountComponent()
        const labels = wrapper.findAll(".filter-label")
        expect(labels[0].text()).toBe("开始时间")
        expect(labels[1].text()).toBe("结束时间")
    })

    it("点击快捷按钮添加 active 类名", async () => {
        const wrapper = mountComponent()
        const items = wrapper.findAll(".shortcut-item")

        await items[0].trigger("click")
        await nextTick()

        expect(items[0].classes()).toContain("active")
    })

    it("点击快捷按钮触发 update:start 和 update:end", async () => {
        const wrapper = mountComponent()
        const items = wrapper.findAll(".shortcut-item")

        // 点击 "今天"
        await items[0].trigger("click")

        const startEvents = wrapper.emitted("update:start")
        const endEvents = wrapper.emitted("update:end")

        expect(startEvents).toBeTruthy()
        expect(endEvents).toBeTruthy()
        expect(startEvents!).toHaveLength(1)
        expect(endEvents!).toHaveLength(1)

        // 验证开始时间是今天 00:00:00
        const startStr = startEvents![0][0] as string
        expect(startStr).toContain("2026-02-12")
        expect(startStr).toContain("T00:00:00")

        // 验证结束时间是当前时刻
        const endStr = endEvents![0][0] as string
        expect(endStr).toContain("2026-02-12")
        expect(endStr).toContain("T14:30:00")
    })

    it("点击快捷按钮触发 change 事件", async () => {
        const wrapper = mountComponent()
        const items = wrapper.findAll(".shortcut-item")

        await items[0].trigger("click")

        const changeEvents = wrapper.emitted("change")
        expect(changeEvents).toBeTruthy()
        expect(changeEvents!).toHaveLength(1)
        // change 事件参数为 (start, end)
        expect(changeEvents![0]).toHaveLength(2)
    })

    it("点击不同快捷按钮切换 active 状态", async () => {
        const wrapper = mountComponent()
        const items = wrapper.findAll(".shortcut-item")

        await items[0].trigger("click")
        await nextTick()
        expect(items[0].classes()).toContain("active")

        await items[2].trigger("click")
        await nextTick()
        // 重新获取 DOM 状态
        const updatedItems = wrapper.findAll(".shortcut-item")
        expect(updatedItems[0].classes()).not.toContain("active")
        expect(updatedItems[2].classes()).toContain("active")
    })

    it("近7天: 开始时间是6天前, 结束时间是当前时刻", async () => {
        const wrapper = mountComponent()
        const items = wrapper.findAll(".shortcut-item")

        // 点击 "近7天"
        await items[1].trigger("click")

        const startStr = wrapper.emitted("update:start")![0][0] as string
        const endStr = wrapper.emitted("update:end")![0][0] as string

        expect(startStr).toContain("2026-02-06")
        expect(startStr).toContain("T00:00:00")
        expect(endStr).toContain("2026-02-12")
        expect(endStr).toContain("T14:30:00")
    })

    it("今年: 开始时间是1月1日, 结束时间是12月31日", async () => {
        const wrapper = mountComponent()
        const items = wrapper.findAll(".shortcut-item")

        // 点击 "今年"
        await items[6].trigger("click")

        const startStr = wrapper.emitted("update:start")![0][0] as string
        const endStr = wrapper.emitted("update:end")![0][0] as string

        expect(startStr).toContain("2026-01-01")
        expect(startStr).toContain("T00:00:00")
        expect(endStr).toContain("2026-12-31")
        expect(endStr).toContain("T23:59:59")
    })

    it("外部清空 start/end 时清除快捷按钮激活状态", async () => {
        const wrapper = mountComponent({ start: "2026-01-01T00:00:00+08:00", end: "2026-01-31T23:59:59+08:00" })
        const items = wrapper.findAll(".shortcut-item")

        // 先激活一个
        await items[0].trigger("click")
        await nextTick()
        expect(items[0].classes()).toContain("active")

        // 模拟外部清空
        await wrapper.setProps({ start: "", end: "" })
        await nextTick()

        const updatedItems = wrapper.findAll(".shortcut-item")
        const hasActive = updatedItems.some((el) => el.classes().includes("active"))
        expect(hasActive).toBe(false)
    })
})
