/**
 * FilePath    : blog-client\src\theme\preset-selector\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 主题预设选择组件测试
 */

import { mount } from "@vue/test-utils"
import { computed, defineComponent } from "vue"
import { beforeEach, describe, expect, it, vi } from "vitest"

import ThemePresetSelector from "."
import type { ThemePreset } from "@/theme/presets"

const { selectSiteCodeBlockThemeMock } = vi.hoisted(() => {
    return {
        selectSiteCodeBlockThemeMock: vi.fn(),
    }
})

vi.mock("@/theme/useTheme", () => {
    return {
        useTheme: () => ({
            activeSiteCodeBlockTheme: computed(() => "tokyo-night-light"),
            codeBlockThemeOptions: computed(() => ["tokyo-night-light", "github"]),
            selectSiteCodeBlockTheme: selectSiteCodeBlockThemeMock,
        }),
    }
})

vi.mock("@/stores/device", () => {
    return {
        DeviceType: {
            PHONE: "phone",
        },
        useDeviceStore: () => ({
            device: "pc",
        }),
    }
})

vi.mock("@/components/common/icons", () => {
    return {
        IconKeys: {
            ThemeDark: "theme-dark",
            ThemeLight: "theme-light",
        },
    }
})

const ElDialogStub = defineComponent({
    name: "ElDialog",
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    template: `
        <div>
            <slot name="header"></slot>
            <slot></slot>
        </div>
    `,
})

const ElSelectStub = defineComponent({
    name: "ElSelect",
    emits: ["change"],
    template: "<button class=\"theme-select-trigger\" @click=\"$emit('change', 'github')\"><slot></slot></button>",
})

const ElOptionStub = defineComponent({
    name: "ElOption",
    props: {
        label: {
            type: String,
            required: false,
        },
        value: {
            type: String,
            required: false,
        },
    },
    template: '<span class="theme-option-stub">{{ label }}{{ value }}</span>',
})

describe("ThemePresetSelector", () => {
    beforeEach(() => {
        selectSiteCodeBlockThemeMock.mockReset()
    })

    it("在主站入口开启时应展示代码块主题选择框并响应切换", async () => {
        const wrapper = mount(ThemePresetSelector, {
            props: {
                modelValue: "light",
                presets: [
                    {
                        id: "light",
                        label: "浅色",
                        description: "默认浅色主题",
                        scheme: "light",
                        palette: {
                            primary: "#111111",
                            secondary: "#222222",
                        },
                    } as unknown as ThemePreset,
                ],
            },
            global: {
                stubs: {
                    "j-icon": true,
                    ElDialog: ElDialogStub,
                    ElSelect: ElSelectStub,
                    ElOption: ElOptionStub,
                },
            },
        })

        expect(wrapper.text()).toContain("代码块主题")
        expect(wrapper.text()).toContain("tokyo-night-light")
        expect(wrapper.text()).toContain("github")

        await wrapper.find(".theme-select-trigger").trigger("click")

        expect(selectSiteCodeBlockThemeMock).toHaveBeenCalledTimes(1)
        expect(selectSiteCodeBlockThemeMock).toHaveBeenCalledWith("github")
    })
})
