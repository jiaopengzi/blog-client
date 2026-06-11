/**
 * FilePath    : blog-client\src\components\editor\hooks\useToolbar-fullscreen.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : useToolbar 全屏按钮显示与状态同步测试
 */

import { createPinia, setActivePinia } from "pinia"
import { mount } from "@vue/test-utils"
import { nextTick, defineComponent, h, ref } from "vue"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { IconKeys } from "@/components/common/icons"

import { CommandsKey } from "../command"
import type { EditorToolbarButton } from "../components/toolbar"
import { EditorStateManager } from "../state"
import { useToolbar } from "./useToolbar"

vi.mock("@vueuse/core", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@vueuse/core")>()

    return {
        ...actual,
        useMagicKeys: () =>
            new Proxy(
                {},
                {
                    get: () => ref(false),
                },
            ),
    }
})

interface ToolbarHostExpose {
    getToolbarBtns: () => EditorToolbarButton[]
    toolbarBtnClicked: (name: CommandsKey) => Promise<void>
    state: ReturnType<EditorStateManager["getState"]>
}

/**
 * createToolbarHost 创建 useToolbar 的测试宿主组件。
 * @param stateManager - 当前测试使用的编辑器状态管理器。
 * @returns 返回一个仅暴露工具栏状态与行为的宿主组件。
 */
function createToolbarHost(stateManager: EditorStateManager) {
    return defineComponent({
        setup(_, { expose }) {
            const mdLayoutRef = ref<HTMLElement | null>(null)
            const mdContainerRef = ref<HTMLElement | null>(null)
            const toolbar = useToolbar(mdLayoutRef, mdContainerRef, stateManager)

            expose({
                getToolbarBtns: (): EditorToolbarButton[] => toolbar.toolbarBtns.value,
                toolbarBtnClicked: toolbar.toolbarBtnClicked,
                state: stateManager.getState(),
            })

            return () => h("div", [h("div", { ref: mdLayoutRef }), h("div", { ref: mdContainerRef })])
        },
    })
}

describe("useToolbar 全屏按钮显示", () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        document.documentElement.style.overflow = ""
    })

    afterEach(() => {
        document.documentElement.style.overflow = ""
    })

    it("进入和退出网页全屏时会同步切换图标与提示文案", async () => {
        const stateManager = new EditorStateManager({
            commandKeys: [CommandsKey.Fullscreen],
        })
        const wrapper = mount(createToolbarHost(stateManager))
        const vm = wrapper.vm as unknown as ToolbarHostExpose

        expect(vm.getToolbarBtns()[0]?.icon).toBe(IconKeys.Fullscreen)
        expect(vm.getToolbarBtns()[0]?.display).toContain("全屏")

        await vm.toolbarBtnClicked(CommandsKey.Fullscreen)
        await nextTick()

        expect(vm.state.isFullScreen).toBe(true)
        expect(document.documentElement.style.overflow).toBe("hidden")
        expect(vm.getToolbarBtns()[0]?.icon).toBe(IconKeys.FullscreenExit)
        expect(vm.getToolbarBtns()[0]?.display).toContain("退出全屏")

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
        await nextTick()

        expect(vm.state.isFullScreen).toBe(false)
        expect(document.documentElement.style.overflow).toBe("")
        expect(vm.getToolbarBtns()[0]?.icon).toBe(IconKeys.Fullscreen)
        expect(vm.getToolbarBtns()[0]?.display).toContain("全屏")

        wrapper.unmount()
    })
})
