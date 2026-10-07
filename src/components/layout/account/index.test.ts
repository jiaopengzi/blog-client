/*
 * FilePath    : blog-client\src\components\layout\account\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 页头账号初始化的水合时序与登录态回归测试
 */

import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils"
import { createPinia, setActivePinia } from "pinia"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { nextTick } from "vue"

import { useUserStore } from "@/stores/user"

import HeaderAccount from "./index.vue"

const mocks = vi.hoisted(() => ({ onReady: vi.fn(), initialize: vi.fn() }))

vi.mock("#app", () => ({ onNuxtReady: mocks.onReady }))
vi.mock("@/stores/init", () => ({ getInitStoresPromise: mocks.initialize }))
vi.mock("@/router", () => ({ RouteNames: { Login: "login", Register: "register" } }))
vi.mock("@/components/common/user-info-dropdown", () => ({ default: { template: '<div class="user-dropdown">账号菜单</div>' } }))
vi.mock("@/stores/user", async () => {
    const { defineStore } = await import("pinia")
    return { useUserStore: defineStore("user", { state: () => ({ isLogin: false }) }) }
})

enableAutoUnmount(afterEach)

/**
 * 挂载页头账号并隔离路由链接, 使用真实 Pinia 响应式状态验证水合前后的展示.
 * @returns 可断言账号 DOM 的组件包装器.
 */
const mountAccount = () => mount(HeaderAccount, { global: { stubs: { RouterLink: { template: "<a><slot /></a>" } } } })

describe("HeaderAccount 水合初始化", () => {
    beforeEach(() => {
        vi.resetAllMocks()
        setActivePinia(createPinia())
    })

    it("水合就绪前不启动 store 初始化, 就绪后正常更新登录态", async () => {
        const user = useUserStore()
        mocks.initialize.mockImplementation(async () => {
            user.isLogin = true
        })
        const wrapper = mountAccount()
        await flushPromises()

        // mounted 及异步 import 完成仍不能越过全局水合边界启动初始化.
        expect(mocks.initialize).not.toHaveBeenCalled()
        expect(wrapper.find(".login").exists()).toBe(true)
        expect(wrapper.find(".avatar").exists()).toBe(false)

        await mocks.onReady.mock.calls[0][0]()
        await nextTick()
        expect(mocks.initialize).toHaveBeenCalledTimes(1)
        expect(wrapper.find(".login").exists()).toBe(false)
        expect(wrapper.find(".user-dropdown").exists()).toBe(true)
    })

    it("初始化失败时保留登录入口且不向外抛出异常", async () => {
        mocks.initialize.mockRejectedValue(new Error("初始化失败"))
        const wrapper = mountAccount()
        await expect(mocks.onReady.mock.calls[0][0]()).resolves.toBeUndefined()
        expect(wrapper.find(".login").exists()).toBe(true)
        expect(wrapper.find(".avatar").exists()).toBe(false)
    })
})
