/**
 * FilePath    : blog-client\src\components\editor\components\toc\__tests__\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 目录组件测试 (260917-01: data-index 定位 + 激活项滚入视野; 260925-04: 激活项只滚目录自身滚动容器, 不连带页面滚动条)
 */

import { mount } from "@vue/test-utils"
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { nextTick } from "vue"

import Toc from "../index.vue"
import type { Heading } from "../types"

const headings: Heading[] = [
    { index: 0, level: 1, text: "一级标题", anchor: "h-1" },
    { index: 1, level: 2, text: "二级标题", anchor: "h-2" },
    { index: 2, level: 3, text: "三级标题", anchor: "h-3" },
]

const mountToc = (headingShowCurrentIndex = 0) => {
    return mount(Toc, {
        props: { headings, headingShowCurrentIndex },
    })
}

describe("EditorToc 组件", () => {
    let scrollIntoViewSpy: ReturnType<typeof vi.fn>

    beforeEach(() => {
        // happy-dom 的 scrollIntoView 为空实现, 统一替换为 spy;
        // 260925-04 后组件不再调用它 (原生实现会连带滚动页面级滚动容器), spy 用于断言"绝不被调用"
        scrollIntoViewSpy = vi.fn()
        Element.prototype.scrollIntoView = scrollIntoViewSpy
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("挂载即高亮初始索引 (260917-01-feedback#2: 晚挂载场景 props 已是终态, 需 immediate 触发首帧高亮)", async () => {
        const wrapper = mountToc(1)
        await nextTick()
        await nextTick()

        const items = wrapper.findAll(".toc-item")
        expect(items[0].classes()).not.toContain("toc-active")
        expect(items[1].classes()).toContain("toc-active")
        // 260925-04: 不得调用原生 scrollIntoView, 页面级滚动容器不允许被连带拖动
        expect(scrollIntoViewSpy).not.toHaveBeenCalled()
    })

    it("渲染目录标题与全部条目, 条目以 data-index 定位且不再输出 id", () => {
        const wrapper = mountToc()
        expect(wrapper.find(".toc-nav").exists()).toBe(true)
        expect(wrapper.find(".toc-title").text()).toBe("目录")

        const items = wrapper.findAll(".toc-item")
        expect(items).toHaveLength(3)
        // 260917-01: 正文可能粘贴含 #toc-N 的内容, 组件自身不再输出 id 避免重复 id
        expect(items[0].attributes("data-index")).toBe("0")
        expect(items[0].attributes("id")).toBeUndefined()
        expect(items[1].classes()).toContain("h-level-2")
    })

    it("headingShowCurrentIndex 变化时高亮对应条目并滚入视野", async () => {
        const wrapper = mountToc(0)
        await nextTick()

        await wrapper.setProps({ headingShowCurrentIndex: 1 })
        await nextTick()
        await nextTick()

        const items = wrapper.findAll(".toc-item")
        expect(items[0].classes()).not.toContain("toc-active")
        expect(items[1].classes()).toContain("toc-active")
        // 260925-04: 滚入视野只调最近滚动容器的 scrollTop, 不调用原生 scrollIntoView
        expect(scrollIntoViewSpy).not.toHaveBeenCalled()
    })

    it("点击条目触发 heading-clicked 事件并本地高亮", async () => {
        const wrapper = mountToc(0)
        await nextTick()

        await wrapper.findAll(".toc-item")[2].trigger("click")
        await nextTick()
        await nextTick()

        expect(wrapper.emitted("heading-clicked")).toEqual([[2]])
        expect(wrapper.findAll(".toc-item")[2].classes()).toContain("toc-active")
    })

    it("260925-04: 激活项低于最近滚动容器可视区时只调整该容器 scrollTop, 不触碰页面级滚动", async () => {
        // 构造带滚动容器的挂载宿主: overflow-y auto + 伪滚动量, 模拟编辑器侧栏 .md-toc / 浮动目录面板
        const host = document.createElement("div")
        host.style.overflowY = "auto"
        document.body.appendChild(host)
        // happy-dom 无真实布局, 手工伪造容器与条目的几何量
        Object.defineProperty(host, "scrollHeight", { value: 1000, configurable: true })
        Object.defineProperty(host, "clientHeight", { value: 300, configurable: true })
        Object.defineProperty(host, "getBoundingClientRect", {
            value: () => ({ top: 100, bottom: 400, left: 0, right: 200, width: 200, height: 300, x: 0, y: 100, toJSON: () => ({}) }),
            configurable: true,
        })

        const wrapper = mount(Toc, {
            props: { headings, headingShowCurrentIndex: 0 },
            attachTo: host,
        })
        await nextTick()
        await nextTick()

        // 挂载即高亮 index 0 时条目尚无伪造几何量 (happy-dom 无布局, rect 为 0), 会把 scrollTop 写成负值;
        // happy-dom 不按 scrollHeight 钳制, 手工归零后再验证目标场景
        host.scrollTop = 0

        // 激活条目底边 (410) 低于容器可视区底边 (400), 期望容器向下补滚 10px 使其可见
        const activeItem = wrapper.findAll(".toc-item")[1]!.element as HTMLElement
        Object.defineProperty(activeItem, "getBoundingClientRect", {
            value: () => ({ top: 380, bottom: 410, left: 0, right: 200, width: 200, height: 30, x: 0, y: 380, toJSON: () => ({}) }),
            configurable: true,
        })

        await wrapper.setProps({ headingShowCurrentIndex: 1 })
        await nextTick()
        await nextTick()

        expect(host.scrollTop).toBe(10)
        // 页面级滚动容器绝不被连带拖动 (原生 scrollIntoView 会沿祖先链滚动到 document)
        expect(scrollIntoViewSpy).not.toHaveBeenCalled()

        wrapper.unmount()
        host.remove()
    })

    it("260925-04: 激活项已在最近滚动容器视野内时不产生多余滚动", async () => {
        const host = document.createElement("div")
        host.style.overflowY = "auto"
        document.body.appendChild(host)
        Object.defineProperty(host, "scrollHeight", { value: 1000, configurable: true })
        Object.defineProperty(host, "clientHeight", { value: 300, configurable: true })
        Object.defineProperty(host, "getBoundingClientRect", {
            value: () => ({ top: 100, bottom: 400, left: 0, right: 200, width: 200, height: 300, x: 0, y: 100, toJSON: () => ({}) }),
            configurable: true,
        })

        const wrapper = mount(Toc, {
            props: { headings, headingShowCurrentIndex: 0 },
            attachTo: host,
        })
        await nextTick()
        await nextTick()

        // 同上: 抹掉挂载即高亮 (无伪造几何量) 阶段写入的负 scrollTop
        host.scrollTop = 0

        // 条目完全位于容器可视区内 (top 150 / bottom 180 均落在 100~400), 不应触发滚动
        const activeItem = wrapper.findAll(".toc-item")[1]!.element as HTMLElement
        Object.defineProperty(activeItem, "getBoundingClientRect", {
            value: () => ({ top: 150, bottom: 180, left: 0, right: 200, width: 200, height: 30, x: 0, y: 150, toJSON: () => ({}) }),
            configurable: true,
        })

        await wrapper.setProps({ headingShowCurrentIndex: 1 })
        await nextTick()
        await nextTick()

        expect(host.scrollTop).toBe(0)
        expect(scrollIntoViewSpy).not.toHaveBeenCalled()

        wrapper.unmount()
        host.remove()
    })
})
