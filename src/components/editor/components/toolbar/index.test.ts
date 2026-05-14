/**
 * FilePath    : blog-client\src\components\editor\components\toolbar\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器工具栏组件测试
 */

import { mount } from "@vue/test-utils"
import { defineComponent } from "vue"
import { describe, expect, it, vi } from "vitest"

import { IconKeys } from "@/components/common/icons"

import { CommandsKey } from "../../command"
import Toolbar from "."

vi.mock("@/customElements", () => ({
    Names: {
        PayDownload: "pay-download",
        PayRead: "pay-read",
        PayKey: "pay-key",
        PayMembership: "pay-membership",
        PayVideo: "pay-video",
        WechatCaptcha: "wechat-captcha",
        LoginView: "login-view",
        VideoPlayer: "video-player",
        PowerBi: "power-bi",
    },
    CustomElementAttributes: [
        "id",
        "class",
        "name",
        "codeurl",
        "key",
        "reply",
        "video-type",
        "poster",
        "src",
        "maskcolor",
        "title",
        "description",
        "has-material",
    ],
}))

vi.mock("@vueuse/core", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@vueuse/core")>()

    return {
        ...actual,
        useResizeObserver: () => ({
            stop: vi.fn(),
        }),
    }
})

const BarStub = defineComponent({
    name: "BarStub",
    template: '<div class="bar-stub"></div>',
})

describe("EditorToolbar", () => {
    it("点击 Vim 按钮时会继续向父组件抛出 toolbar-btn-clicked 事件", async () => {
        const wrapper = mount(Toolbar, {
            props: {
                toolbarBtns: [
                    {
                        name: CommandsKey.Vim,
                        display: "Vim 模式",
                        icon: IconKeys.Vim,
                    },
                ],
                vimMode: false,
            },
            global: {
                stubs: {
                    BarPay: BarStub,
                    BarHeading: BarStub,
                    BarEmoji: BarStub,
                    BarTable: BarStub,
                    BarAlert: BarStub,
                    BarTool: BarStub,
                    BarVim: BarStub,
                    ElTooltip: defineComponent({
                        name: "ElTooltip",
                        template: "<div><slot /></div>",
                    }),
                    JIcon: defineComponent({
                        name: "JIcon",
                        template: '<span class="j-icon-stub"></span>',
                    }),
                },
            },
        })

        await wrapper.get("button.toolbar-btn").trigger("click")

        expect(wrapper.emitted("toolbar-btn-clicked")).toEqual([[CommandsKey.Vim]])
    })
})
