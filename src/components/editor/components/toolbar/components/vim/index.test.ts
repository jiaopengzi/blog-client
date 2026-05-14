/**
 * FilePath    : blog-client\src\components\editor\components\toolbar\components\vim\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : vim 组件测试
 */

import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import { describe, expect, it } from "vitest"

import { IconKeys } from "@/components/common/icons"

import BarVim from "."

const ElPopoverStub = defineComponent({
    name: "ElPopover",
    props: {
        trigger: {
            type: String,
            default: "click",
        },
    },
    template: `
        <div class="el-popover-stub" :data-trigger="trigger">
            <div class="reference"><slot name="reference" /></div>
            <div class="content"><slot /></div>
        </div>
    `,
})

const ElButtonStub = defineComponent({
    name: "ElButton",
    emits: ["click"],
    setup(_, { emit, slots }) {
        return () => h("button", { class: "el-button-stub", onClick: () => emit("click") }, slots.default?.())
    },
})

const SwitchGroupStub = defineComponent({
    name: "SwitchGroup",
    emits: ["update-status"],
    setup(_, { emit }) {
        return () =>
            h(
                "button",
                {
                    class: "switch-group-stub",
                    onClick: () => emit("update-status", [{ name: "vim-mode", display: "Vim 模式", status: true }]),
                },
                "switch",
            )
    },
})

describe("BarVim", () => {
    it("使用 hover 触发弹层, 同时保留菜单内切换 Vim 状态的能力", async () => {
        const wrapper = mount(BarVim, {
            props: {
                icon: IconKeys.Vim,
                vimMode: false,
            },
            global: {
                stubs: {
                    ElPopover: ElPopoverStub,
                    ElButton: ElButtonStub,
                    SwitchGroup: SwitchGroupStub,
                    JIcon: defineComponent({
                        name: "JIcon",
                        template: '<span class="j-icon-stub"></span>',
                    }),
                },
            },
        })

        expect(wrapper.get(".el-popover-stub").attributes("data-trigger")).toBe("hover")

        await wrapper.get(".switch-group-stub").trigger("click")

        expect(wrapper.emitted("vim-mode-change")).toEqual([[true]])
    })
})
