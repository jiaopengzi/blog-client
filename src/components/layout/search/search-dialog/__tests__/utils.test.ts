/**
 * FilePath    : blog-client\src\components\layout\search\search-dialog\__tests__\utils.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 搜索历史纯逻辑测试 (解析容错 / 去重置顶 / 条数上限 / id 唯一性) (bugfix 260918-06)
 */

import { describe, expect, it } from "vitest"

import { SEARCH_HISTORY_MAX_COUNT, buildNextSearchHistory, parseSearchHistory } from "../utils"

import type { SearchHistoryItem } from "../types"

/** 构造一条历史项, 时间戳递增保证 id 与 time 唯一. */
const makeItem = (id: number, value: string): SearchHistoryItem => ({ id, value, time: 1_000_000 + id })

describe("parseSearchHistory", () => {
    it("null 与空字符串应解析为空列表", () => {
        expect(parseSearchHistory(null)).toEqual([])
        expect(parseSearchHistory("")).toEqual([])
    })

    it("合法 JSON 数组应原样解析", () => {
        const raw = JSON.stringify([makeItem(1, "nuxt"), makeItem(2, "ssr")])
        expect(parseSearchHistory(raw)).toEqual([makeItem(1, "nuxt"), makeItem(2, "ssr")])
    })

    it("损坏的 JSON 应回退为空列表", () => {
        expect(parseSearchHistory("{broken json")).toEqual([])
    })

    it("非数组 JSON 应回退为空列表", () => {
        expect(parseSearchHistory('{"value":"nuxt"}')).toEqual([])
    })

    it("缺 value 字段的脏项应被过滤", () => {
        const raw = JSON.stringify([{ id: 1, time: 1 }, makeItem(2, "nuxt")])
        expect(parseSearchHistory(raw)).toEqual([makeItem(2, "nuxt")])
    })
})

describe("buildNextSearchHistory", () => {
    it("新搜索词应插入到最前且不改入参", () => {
        const list = [makeItem(1, "a"), makeItem(2, "b")]
        const next = buildNextSearchHistory(list, "c", 3_000_000)

        expect(next.map((item) => item.value)).toEqual(["c", "a", "b"])
        expect(next[0]).toEqual({ id: 3_000_000, value: "c", time: 3_000_000 })
        expect(list.map((item) => item.value)).toEqual(["a", "b"])
    })

    it("已存在的搜索词应更新时间并移到最前", () => {
        const list = [makeItem(1, "a"), makeItem(2, "b"), makeItem(3, "c")]
        const next = buildNextSearchHistory(list, "b", 3_000_000)

        expect(next.map((item) => item.value)).toEqual(["b", "a", "c"])
        expect(next[0]!.time).toBe(3_000_000)
        // id 保持稳定, 不因重新搜索变化
        expect(next[0]!.id).toBe(2)
        expect(next).toHaveLength(3)
    })

    it("超过上限时只保留最新的条数", () => {
        const list = Array.from({ length: SEARCH_HISTORY_MAX_COUNT }, (_, i) => makeItem(i, `kw-${i}`))
        const next = buildNextSearchHistory(list, "extra", 9_000_000)

        expect(next).toHaveLength(SEARCH_HISTORY_MAX_COUNT)
        expect(next[0]!.value).toBe("extra")
        // 列表尾部最旧的 kw-19 被挤出
        expect(next.some((item) => item.value === "kw-19")).toBe(false)
        expect(next[1]!.value).toBe("kw-0")
    })

    it("删除中间项后再新增不会产生重复 id (原 bug: id 取数组长度)", () => {
        // 原实现: [0,1,2] 删 1 后 [0,2], 新增 id 取 length=2 与已有 id=2 重复
        const list = [makeItem(0, "a"), makeItem(2, "c")]
        const next = buildNextSearchHistory(list, "d", 3_000_000)

        const ids = next.map((item) => item.id)
        expect(new Set(ids).size).toBe(ids.length)
    })
})
