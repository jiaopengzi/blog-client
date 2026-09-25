/**
 * FilePath    : blog-client\src\components\hooks\useWebFullscreen\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : useWebFullscreen hook 测试
 */

import { mount } from "@vue/test-utils"
import { defineComponent, h, ref } from "vue"
import { afterEach, describe, expect, it } from "vitest"

import { useWebFullscreen } from "."

interface FullscreenExpose {
    enter: () => void
    isWebFullscreen: boolean
}

function createFullscreenHost(shouldIgnoreEscape?: (event: KeyboardEvent) => boolean) {
    return defineComponent({
        setup(_, { expose }) {
            const rootRef = ref<HTMLElement | null>(null)
            const fullscreen = useWebFullscreen(rootRef, { shouldIgnoreEscape })

            expose(fullscreen)

            return () => h("div", { ref: rootRef })
        },
    })
}

describe("useWebFullscreen", () => {
    afterEach(() => {
        document.documentElement.style.overflow = ""
        document.body.classList.remove("web-fullscreen-active")
    })

    it("默认情况下按下 Escape 会退出网页全屏", async () => {
        const wrapper = mount(createFullscreenHost())
        const vm = wrapper.vm as unknown as FullscreenExpose

        vm.enter()
        expect(vm.isWebFullscreen).toBe(true)

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))

        expect(vm.isWebFullscreen).toBe(false)

        wrapper.unmount()
    })

    it("命中 shouldIgnoreEscape 守卫时不会退出网页全屏", async () => {
        const wrapper = mount(createFullscreenHost(() => true))
        const vm = wrapper.vm as unknown as FullscreenExpose

        vm.enter()
        expect(vm.isWebFullscreen).toBe(true)

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))

        expect(vm.isWebFullscreen).toBe(true)

        wrapper.unmount()
    })

    it("260925-05: 进出全屏同步切换 body 标记类 (布局用它隐藏全局 UP 回顶按钮)", async () => {
        const wrapper = mount(createFullscreenHost())
        const vm = wrapper.vm as unknown as FullscreenExpose

        vm.enter()
        expect(document.body.classList.contains("web-fullscreen-active")).toBe(true)

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
        expect(document.body.classList.contains("web-fullscreen-active")).toBe(false)

        // 组件卸载路径同样要摘除标记类, 避免残留隐藏布局按钮
        vm.enter()
        wrapper.unmount()
        expect(document.body.classList.contains("web-fullscreen-active")).toBe(false)
    })
})
