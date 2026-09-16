/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\lazyRuleRegistry.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 测试懒加载规则注册
 */

import { describe, expect, it } from "vitest"

import { getLazyRuleLoaders } from "./lazyRuleRegistry"

describe("getLazyRuleLoaders 函数", () => {
    it("应返回按规则路径索引的延迟加载器", () => {
        const loaders = getLazyRuleLoaders()
        const paths = Object.keys(loaders)

        expect(paths.length).toBeGreaterThan(0)
        expect(paths[0]).toContain("/rule/")
        expect(typeof loaders[paths[0] as keyof typeof loaders]).toBe("function")
    })

    it("应能异步加载规则定义", async () => {
        const loaders = getLazyRuleLoaders()
        const firstPath = Object.keys(loaders)[0]
        const rule = await loaders[firstPath]!()

        expect(rule).toBeTruthy()
        expect(typeof rule?.run).toBe("function")
        expect(String(rule?.id)).toMatch(/^rule\d+$/)
    })
})
