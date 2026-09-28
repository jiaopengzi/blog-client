/**
 * FilePath    : blog-client\src\components\common\stat-scripts\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 统计脚本加载器回归测试, 覆盖百度 CORS/Referer 兼容及 GA 加载隔离
 */

import { mockNuxtImport } from "@nuxt/test-utils/runtime"
import { enableAutoUnmount, mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import StatScripts from "./index.vue"

const { useScriptMock, useScriptGoogleAnalyticsMock } = vi.hoisted(() => ({
    useScriptMock: vi.fn(),
    useScriptGoogleAnalyticsMock: vi.fn(),
}))

mockNuxtImport("useScript", () => useScriptMock)
mockNuxtImport("useScriptGoogleAnalytics", () => useScriptGoogleAnalyticsMock)

enableAutoUnmount(afterEach)

describe("StatScripts", () => {
    const baiduId = "e5d3d5e35956991cf1f880f728464707"
    const analyticsWindow = window as unknown as Record<string, unknown>

    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubGlobal("_hmt", undefined)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("百度脚本移除默认 CORS 和 Referrer 限制并在加载前初始化命令队列", () => {
        useScriptMock.mockImplementationOnce(() => {
            expect(analyticsWindow["_hmt"]).toEqual([])
        })

        mount(StatScripts, { props: { baiduId } })

        expect(useScriptMock).toHaveBeenCalledTimes(1)
        expect(useScriptMock).toHaveBeenCalledWith(
            {
                src: `https://hm.baidu.com/hm.js?${baiduId}`,
                crossorigin: false,
                referrerpolicy: false,
            },
            {
                trigger: "onNuxtReady",
                use: expect.any(Function),
            },
        )
    })

    it("保留已有百度命令队列并通过 use 返回同一引用", () => {
        const queue = [["_trackPageview", "/existing"]]
        vi.stubGlobal("_hmt", queue)

        mount(StatScripts, { props: { baiduId } })

        expect(analyticsWindow["_hmt"]).toBe(queue)
        expect(useScriptMock.mock.calls[0][1].use().hmt).toBe(queue)
    })

    it("同时配置百度与多个 GA id 时保留 GA registry 加载参数", () => {
        const gaIds = ["G-RVHJ5XT98W", "G-SECOND123"]

        mount(StatScripts, { props: { baiduId, gaIds } })

        expect(useScriptMock).toHaveBeenCalledTimes(1)
        expect(useScriptGoogleAnalyticsMock).toHaveBeenCalledTimes(gaIds.length)
        for (const [index, gaId] of gaIds.entries()) {
            expect(useScriptGoogleAnalyticsMock).toHaveBeenNthCalledWith(index + 1, {
                id: gaId,
                scriptOptions: { trigger: "onNuxtReady" },
            })
        }
    })

    it("未配置统计 id 时不加载脚本或初始化百度队列", () => {
        mount(StatScripts)

        expect(useScriptMock).not.toHaveBeenCalled()
        expect(useScriptGoogleAnalyticsMock).not.toHaveBeenCalled()
        expect(analyticsWindow["_hmt"]).toBeUndefined()
    })
})
