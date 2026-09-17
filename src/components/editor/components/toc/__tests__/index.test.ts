/**
 * FilePath    : blog-client\src\components\editor\components\toc\__tests__\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 目录组件测试 (260917-01: data-index 定位 + 激活项滚入视野)
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
        // happy-dom 的 scrollIntoView 为空实现, 统一替换为 spy 断言"激活项滚入视野"行为
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
        expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: "nearest" })
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
        // 激活项以 nearest 滚入最近滚动容器 (列表内部滚动场景保持可见)
        expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: "nearest" })
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
})
