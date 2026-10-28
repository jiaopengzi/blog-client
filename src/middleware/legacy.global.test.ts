/*
 * FilePath    : blog-client\src\middleware\legacy.global.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 老链接软导航的动态路径段编码及真实路由导航回归测试.
 */

import type { RouteMiddleware } from "#app"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { createMemoryHistory, createRouter } from "vue-router"

const mocks = vi.hoisted(() => {
    const navigateTo = vi.fn()
    return { navigateTo }
})

vi.mock("#app", () => ({
    defineNuxtRouteMiddleware: (middleware: RouteMiddleware) => middleware,
    navigateTo: mocks.navigateTo,
}))

import legacyMiddleware from "./legacy.global"

// 使用真实路由解析器校验路径语义, 避免仅断言 navigateTo 参数而漏掉二次解码.
const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: "/", component: {} },
        { path: "/p/:value", component: {} },
        { path: "/category/:value", component: {} },
        { path: "/tag/:value", component: {} },
        { path: "/year/:value", component: {} },
        { path: "/year/:value/month/:month", component: {} },
        { path: "/s/:value", component: {} },
        { path: "/:pathMatch(.*)*", component: {} },
    ],
})

/**
 * 执行首页老链接中间件并由真实路由解析目标.
 * @param query 已解码的旧链接查询参数.
 * @returns 目标路由解析结果的 Promise; 中间件未发起重定向时断言失败.
 */
const resolveLegacyTarget = async (query: Record<string, string>) => {
    await router.push({ path: "/", query })
    const route = router.currentRoute.value
    legacyMiddleware(route, route)
    expect(mocks.navigateTo).toHaveBeenCalledTimes(1)
    expect(mocks.navigateTo.mock.calls[0]?.[1]).toEqual({ redirectCode: 301 })
    return router.resolve(mocks.navigateTo.mock.calls[0]![0])
}

beforeEach(() => {
    mocks.navigateTo.mockClear()
})

describe("老链接软导航动态段编码", () => {
    const branches = [
        ["post_id", "/p/"],
        ["post_category_slug", "/category/"],
        ["post_tag_slug", "/tag/"],
        ["year", "/year/"],
        ["key_word", "/s/"],
        ["s", "/s/"],
    ] as const

    const specialCharacterCases = branches.flatMap(([key, prefix]) =>
        ["a?b", "a#b", "a/b", "中文", "%0a", "a\nb"].map((value) => [key, prefix, value] as const),
    )

    it.each(specialCharacterCases)("%s (%s) 的 %s 保持为单个动态段", async (key, prefix, value) => {
        const target = await resolveLegacyTarget({ [key]: value, current_page: "2", page_size: "10", keep: "a?b#c" })
        expect(target.path).toBe(`${prefix}${encodeURIComponent(value)}`)
        expect(target.params.value).toBe(value)
        expect(target.query).toEqual({ page: "2", size: "10", keep: "a?b#c" })
        expect(target.hash).toBe("")
    })

    it("年月归档的两个动态段分别编码", async () => {
        const target = await resolveLegacyTarget({ year: "20?26", month: "10/#%0a", current_page: "2" })
        expect(target.path).toBe("/year/20%3F26/month/10%2F%23%250a")
        expect(target.params).toEqual({ value: "20?26", month: "10/#%0a" })
        expect(target.query).toEqual({ page: "2" })
    })

    it("纯分页简写翻译保持原有语义", async () => {
        const target = await resolveLegacyTarget({ current_page: "3", page_size: "20" })
        expect(target.fullPath).toBe("/?page=3&size=20")
    })

    it("非首页的同名查询参数不触发老链接重定向", async () => {
        await router.push({
            path: "/s/test",
            query: { post_id: "1", post_category_slug: "2", post_tag_slug: "3", year: "2026", month: "10", key_word: "a", s: "b", current_page: "2" },
        })
        const route = router.currentRoute.value
        expect(legacyMiddleware(route, route)).toBeUndefined()
        expect(mocks.navigateTo).not.toHaveBeenCalled()
    })

    it("无旧参数的首页不发起重定向", async () => {
        await router.push("/")
        const route = router.currentRoute.value
        expect(legacyMiddleware(route, route)).toBeUndefined()
        expect(mocks.navigateTo).not.toHaveBeenCalled()
    })
})
