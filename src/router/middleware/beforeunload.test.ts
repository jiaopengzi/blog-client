/**
 * FilePath    : blog-client\src\router\middleware\beforeunload.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 页面关闭中间件测试
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { LocalStorageKey } from "@/stores/local"

beforeEach(() => {
    vi.resetModules()
})

afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
})

describe("beforeunloadMiddleware", () => {
    it("关闭页面时只清理缓存, 不再阻止离开或写入确认文案", async () => {
        const { beforeunloadMiddleware } = await import("./beforeunload")
        const addEventListenerSpy = vi.spyOn(window, "addEventListener")
        localStorage.setItem(LocalStorageKey.OptionsApp, "cached")

        await expect(beforeunloadMiddleware()).resolves.toBe(true)

        const handler = addEventListenerSpy.mock.calls.find(([eventName]) => eventName === "beforeunload")?.[1]
        expect(typeof handler).toBe("function")

        const event = {
            preventDefault: vi.fn(),
            returnValue: undefined as string | undefined,
        }
        ;(handler as EventListener)(event as unknown as Event)

        expect(event.preventDefault).not.toHaveBeenCalled()
        expect(event.returnValue).toBeUndefined()
        expect(localStorage.getItem(LocalStorageKey.OptionsApp)).toBeNull()
    })

    it("多次执行中间件时只注册一次 beforeunload 监听", async () => {
        const { beforeunloadMiddleware } = await import("./beforeunload")
        const addEventListenerSpy = vi.spyOn(window, "addEventListener")

        await beforeunloadMiddleware()
        await beforeunloadMiddleware()

        expect(addEventListenerSpy.mock.calls.filter(([eventName]) => eventName === "beforeunload")).toHaveLength(1)
    })
})
