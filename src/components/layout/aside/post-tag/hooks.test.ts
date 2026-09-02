/*
 * FilePath    : blog-client-nuxt\src\components\layout\aside\post-tag\hooks.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章标签侧栏数据边界测试
 */

import { describe, expect, it } from "vitest"

import { normalizePostTags } from "./hooks"

describe("normalizePostTags", () => {
    it("接口未返回标签数据时返回空数组", () => {
        expect(normalizePostTags(undefined)).toEqual([])
        expect(normalizePostTags(null)).toEqual([])
    })

    it("保留有效的标签数组", () => {
        const tags = [{ id: "1", name: "Nuxt" }]

        expect(normalizePostTags(tags)).toBe(tags)
    })
})
