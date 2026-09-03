/*
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\dashboard\post-visit-top\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 内容访问排行类型与持久化辅助的单元测试
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { LocalStorageKey } from "@/stores/local"

import { getSavedPostVisitTopSelection, persistPostVisitTopSelection } from "./hooks"
import { alignPostVisitTopN, clampPostVisitTopN, postVisitRangeToDimension, PostVisitRange, POST_VISIT_TOP_N_DEFAULT, stepPostVisitTopN } from "./types"

describe("postVisitRangeToDimension 的测试", () => {
    it.each([
        [PostVisitRange.Today, "day", true],
        [PostVisitRange.Yesterday, "day", false],
        [PostVisitRange.ThisWeek, "week", true],
        [PostVisitRange.LastWeek, "week", false],
        [PostVisitRange.ThisMonth, "month", true],
        [PostVisitRange.LastMonth, "month", false],
    ])("%s 映射为 %s/%s", (range, dimension, isCurrent) => {
        expect(postVisitRangeToDimension(range)).toEqual({ dimension, isCurrent })
    })
})

describe("clampPostVisitTopN 的测试", () => {
    it("正常值原样返回", () => {
        expect(clampPostVisitTopN(10)).toBe(10)
        expect(clampPostVisitTopN(1)).toBe(1)
        expect(clampPostVisitTopN(100)).toBe(100)
    })

    it("非法值回退默认 10", () => {
        expect(clampPostVisitTopN(Number.NaN)).toBe(POST_VISIT_TOP_N_DEFAULT)
        expect(clampPostVisitTopN(Number.POSITIVE_INFINITY)).toBe(POST_VISIT_TOP_N_DEFAULT)
    })

    it("越界值收敛到边界", () => {
        expect(clampPostVisitTopN(0)).toBe(1)
        expect(clampPostVisitTopN(-5)).toBe(1)
        expect(clampPostVisitTopN(101)).toBe(100)
        expect(clampPostVisitTopN(9999)).toBe(100)
    })

    it("小数向下取整", () => {
        expect(clampPostVisitTopN(10.9)).toBe(10)
    })
})

describe("stepPostVisitTopN 的测试", () => {
    it("加号按集合向上对齐", () => {
        expect(stepPostVisitTopN(1, 1)).toBe(10)
        expect(stepPostVisitTopN(11, 1)).toBe(20)
        expect(stepPostVisitTopN(10, 1)).toBe(20)
        expect(stepPostVisitTopN(55, 1)).toBe(60)
        expect(stepPostVisitTopN(95, 1)).toBe(100)
    })

    it("加号在 100 端点保持不变", () => {
        expect(stepPostVisitTopN(100, 1)).toBe(100)
        expect(stepPostVisitTopN(120, 1)).toBe(100)
    })

    it("减号按集合向下对齐", () => {
        expect(stepPostVisitTopN(11, -1)).toBe(10)
        expect(stepPostVisitTopN(10, -1)).toBe(1)
        expect(stepPostVisitTopN(20, -1)).toBe(10)
        expect(stepPostVisitTopN(55, -1)).toBe(50)
        expect(stepPostVisitTopN(100, -1)).toBe(90)
    })

    it("减号在 1 端点保持不变", () => {
        expect(stepPostVisitTopN(1, -1)).toBe(1)
        expect(stepPostVisitTopN(0, -1)).toBe(1)
    })
})

describe("alignPostVisitTopN 的测试", () => {
    it("就近对齐到集合(平局取较大)", () => {
        expect(alignPostVisitTopN(5)).toBe(10)
        expect(alignPostVisitTopN(4)).toBe(1)
        expect(alignPostVisitTopN(14)).toBe(10)
        expect(alignPostVisitTopN(15)).toBe(20)
        expect(alignPostVisitTopN(10)).toBe(10)
        expect(alignPostVisitTopN(1)).toBe(1)
    })

    it("越界与非法值收敛后再对齐", () => {
        expect(alignPostVisitTopN(0)).toBe(1)
        expect(alignPostVisitTopN(999)).toBe(100)
        expect(alignPostVisitTopN(Number.NaN)).toBe(10)
    })
})

describe("post visit top 选择持久化的测试", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it("无缓存时返回 null", () => {
        expect(getSavedPostVisitTopSelection()).toBeNull()
    })

    it("持久化后能读回合法值", () => {
        persistPostVisitTopSelection(PostVisitRange.ThisMonth, 20)
        expect(getSavedPostVisitTopSelection()).toEqual({ range: PostVisitRange.ThisMonth, topN: 20 })
    })

    it("非法 range 缓存返回 null", () => {
        localStorage.setItem(LocalStorageKey.DashboardPostVisitTopSelection, JSON.stringify({ range: "bad", topN: 10 }))
        expect(getSavedPostVisitTopSelection()).toBeNull()
    })

    it("越界 topN 缓存被收敛", () => {
        localStorage.setItem(LocalStorageKey.DashboardPostVisitTopSelection, JSON.stringify({ range: "today", topN: 999 }))
        expect(getSavedPostVisitTopSelection()).toEqual({ range: PostVisitRange.Today, topN: 100 })
    })

    it("损坏 JSON 返回 null", () => {
        localStorage.setItem(LocalStorageKey.DashboardPostVisitTopSelection, "{bad json")
        expect(getSavedPostVisitTopSelection()).toBeNull()
    })
})
