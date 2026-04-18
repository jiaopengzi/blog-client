/**
 * FilePath    : blog-client\src\components\common\login-view\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 登录提示组件单元测试
 */

import { mount } from "@vue/test-utils"
import { afterEach, describe, expect, it, vi } from "vitest"
import { defineComponent, ref } from "vue"

const isLoginRef = ref(false)
const mockPush = vi.fn()

vi.mock("@/customElements", () => ({
    Names: {
        LoginView: "login-view",
        VideoPlayer: "video-player",
        PowerBi: "power-bi",
    },
    parseHtmlToContentParts: (html: string) => {
        if (!html) return []
        return [{ type: "html", content: html }]
    },
}))

vi.mock("@/components/player", () => ({
    default: defineComponent({ name: "VideoPlayer", template: "<div />" }),
}))

vi.mock("@/components/common/power-bi/index.vue", () => ({
    default: defineComponent({ name: "PowerBi", template: "<div />" }),
}))

vi.mock("@/stores/user", () => ({
    useUserStore: () => ({
        isLogin: isLoginRef,
    }),
}))

vi.mock("pinia", async (importOriginal) => {
    const actual = await importOriginal<typeof import("pinia")>()
    return {
        ...actual,
        storeToRefs: (store: Record<string, unknown>) => store,
    }
})

vi.mock("vue-router", () => ({
    useRouter: () => ({
        push: mockPush,
        currentRoute: { value: { fullPath: "/" } },
    }),
}))

vi.mock("@/router/types", () => ({
    RouteNames: { Login: "login" },
}))

import LoginView from "./index.vue"

afterEach(() => {
    vi.clearAllMocks()
    isLoginRef.value = false
})

describe("LoginView", () => {
    it("未登录时显示登录提示", () => {
        const wrapper = mount(LoginView, {
            props: {
                hiddenHtml: "<p>隐藏内容</p>",
            },
        })

        expect(wrapper.find(".login-view-lock").exists()).toBe(true)
        expect(wrapper.find(".login-view-btn").exists()).toBe(true)
        expect(wrapper.find(".login-view-content").exists()).toBe(false)
    })

    it("已登录时显示隐藏内容", () => {
        isLoginRef.value = true

        const wrapper = mount(LoginView, {
            props: {
                hiddenHtml: "<p>隐藏内容</p>",
            },
        })

        expect(wrapper.find(".login-view-content").exists()).toBe(true)
        expect(wrapper.find(".login-view-content").html()).toContain("隐藏内容")
        expect(wrapper.find(".login-view-lock").exists()).toBe(false)
    })

    it("点击登录按钮触发路由跳转", async () => {
        const wrapper = mount(LoginView, {
            props: {
                hiddenHtml: "<p>隐藏内容</p>",
            },
        })

        await wrapper.find(".login-view-btn").trigger("click")

        expect(mockPush).toHaveBeenCalledWith({
            name: "login",
            query: {
                redirect: "/",
            },
        })
    })
})
