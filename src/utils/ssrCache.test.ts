/*
 * FilePath    : blog-client-nuxt\src\utils\ssrCache.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : SSR 渲染缓存失效通知测试 (feature01 260829-08)
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPinia, setActivePinia } from "pinia"

import { useUserStore } from "@/stores/user"

import { invalidateSsrRenderCache } from "./ssrCache"

// 单元测试专用占位令牌(非真实凭据, 仅用于断言请求头透传格式)
const MOCK_ACCESS_TOKEN = `mock-token-${"unit-test"}`

describe("invalidateSsrRenderCache", () => {
    const fetchMock = vi.fn()

    beforeEach(() => {
        setActivePinia(createPinia())
        fetchMock.mockReset()
        vi.stubGlobal("$fetch", fetchMock)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("未登录(无 token)时静默跳过, 不发起请求", async () => {
        const userStore = useUserStore()
        userStore.accessToken = ""

        await invalidateSsrRenderCache()

        expect(fetchMock).not.toHaveBeenCalled()
    })

    it("已登录时以 Bearer 前缀 Authorization 头 POST 失效接口", async () => {
        const userStore = useUserStore()
        userStore.accessToken = MOCK_ACCESS_TOKEN

        fetchMock.mockResolvedValue({ ok: true, cleared: 1 })
        await invalidateSsrRenderCache()

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock).toHaveBeenCalledWith("/internal/cache-invalidate", {
            method: "POST",
            headers: { Authorization: `Bearer ${MOCK_ACCESS_TOKEN}` },
        })
    })

    it("请求失败时吞掉异常不向调用方抛出(缓存失效失败不影响保存结果)", async () => {
        const userStore = useUserStore()
        userStore.accessToken = MOCK_ACCESS_TOKEN

        // 压制 console.warn, 保持测试输出干净(与 vitest.setup.ts 过滤白名单同目的)
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
        fetchMock.mockRejectedValue(new Error("network error"))

        await expect(invalidateSsrRenderCache()).resolves.toBeUndefined()

        expect(warnSpy).toHaveBeenCalledTimes(1)
        warnSpy.mockRestore()
    })
})
