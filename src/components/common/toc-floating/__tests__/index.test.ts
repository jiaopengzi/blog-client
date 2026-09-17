/**
 * FilePath    : blog-client\src\components\common\toc-floating\__tests__\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 右侧浮动目录测试 (260917-01: 折叠/展开与偏好持久化; feedback#3 详情页右侧承载, immersive 落位区分)
 */

import { flushPromises, mount } from "@vue/test-utils"
import { createPinia, setActivePinia } from "pinia"
import { describe, expect, it, beforeEach } from "vitest"
import { defineComponent } from "vue"
import { createMemoryHistory, createRouter, type Router } from "vue-router"

import TocFloating from "../index.vue"
import { LocalStorageKey } from "@/stores/local"
import { useStatusStore } from "@/stores/status"

const tocHtml = [
    { index: 0, level: 1, text: "一级标题", anchor: "h-1" },
    { index: 1, level: 2, text: "二级标题", anchor: "h-2" },
]

// j-icon 为全局注册组件 (plugins/directives.ts), 单测以桩替代避免解析告警
const JIconStub = defineComponent({ name: "JIcon", props: { name: String, customClass: String }, render: () => null })

describe("TocFloating 组件", () => {
    let router: Router
    let statusStore: ReturnType<typeof useStatusStore>

    beforeEach(async () => {
        localStorage.removeItem(LocalStorageKey.TocFloatingCollapsed)
        setActivePinia(createPinia())
        router = createRouter({
            history: createMemoryHistory(),
            routes: [{ path: "/p/:id", name: "post", component: { render: () => null } }],
        })
        await router.push("/p/123")
        statusStore = useStatusStore()
        statusStore.tocHtml = [...tocHtml]
        statusStore.tocHeadingShowCurrentIndex = 1
    })

    const mountFloating = () => {
        return mount(TocFloating, {
            global: { plugins: [router], components: { "j-icon": JIconStub } },
        })
    }

    it("默认折叠: 悬浮按钮展示当前章节名", async () => {
        const wrapper = mountFloating()
        await flushPromises()

        expect(wrapper.find(".toc-floating-trigger").exists()).toBe(true)
        expect(wrapper.find(".toc-floating-current").text()).toBe("二级标题")
        expect(wrapper.find(".toc-floating-panel").exists()).toBe(false)
    })

    it("点击展开显示目录面板: 标题单一无重复且初始高亮当前章节, 再收起并同步持久化偏好", async () => {
        const wrapper = mountFloating()
        await flushPromises()

        await wrapper.find(".toc-floating-trigger").trigger("click")
        const panel = wrapper.find(".toc-floating-panel")
        expect(panel.exists()).toBe(true)
        expect(wrapper.findAll(".toc-item")).toHaveLength(2)
        // 260917-01-feedback#2: 标题仅由 Toc 内部 h2 承担, 面板不再重复输出"目录"
        expect(panel.findAll(".toc-title")).toHaveLength(1)
        // 260917-01-feedback#2: 晚挂载首帧即高亮 store 中的当前索引 (beforeEach 已设 1)
        expect(panel.find('.toc-item[data-index="1"]').classes()).toContain("toc-active")
        expect(localStorage.getItem(LocalStorageKey.TocFloatingCollapsed)).toBe("false")

        await wrapper.find(".toc-floating-close").trigger("click")
        expect(wrapper.find(".toc-floating-trigger").exists()).toBe(true)
        expect(localStorage.getItem(LocalStorageKey.TocFloatingCollapsed)).toBe("true")
    })

    it("localStorage 记忆展开态时, 重挂载直接展开", async () => {
        localStorage.setItem(LocalStorageKey.TocFloatingCollapsed, "false")
        const wrapper = mountFloating()
        await flushPromises()

        expect(wrapper.find(".toc-floating-panel").exists()).toBe(true)
    })

    it("260917-01-feedback#3: 普通详情模式默认落位避开 header, 沉浸模式贴近视口顶部", async () => {
        // 默认 (immersive=false): 详情页落位, 不带 immersive 类
        const normal = mountFloating()
        await flushPromises()
        expect(normal.find(".toc-floating").classes()).not.toContain("toc-floating--immersive")

        // 沉浸模式: 带 immersive 类 (header 被沉浸层覆盖, top 贴近视口顶)
        const immersive = mount(TocFloating, {
            props: { immersive: true },
            global: { plugins: [router], components: { "j-icon": JIconStub } },
        })
        await flushPromises()
        expect(immersive.find(".toc-floating").classes()).toContain("toc-floating--immersive")
    })
})
