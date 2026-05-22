/**
 * FilePath    : blog-client\src\components\hooks\useMedia\useData.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : useData 媒体列表展示模式测试
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { LocalStorageKey } from "@/stores/local"

import { getInitialShowListOrGridStatus, useData } from "./useData"

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    localStorage.clear()
})

describe("getInitialShowListOrGridStatus", () => {
    it("localStorage 中没有记录时默认使用列表模式", () => {
        expect(getInitialShowListOrGridStatus()).toBe(true)
    })

    it("localStorage 中显式记录 false 时使用宫格模式", () => {
        localStorage.setItem(LocalStorageKey.IsShowListOrGridAtMedia, "false")

        expect(getInitialShowListOrGridStatus()).toBe(false)
    })

    it("localStorage 中显式记录 true 时使用列表模式", () => {
        localStorage.setItem(LocalStorageKey.IsShowListOrGridAtMedia, "true")

        expect(getInitialShowListOrGridStatus()).toBe(true)
    })
})

describe("useData", () => {
    it("首次进入媒体页时展示模式与默认列表保持一致", () => {
        const { showListOrGridStatus } = useData()

        expect(showListOrGridStatus.value).toBe(true)
    })

    it("读取到已持久化的宫格配置时保持宫格模式", () => {
        localStorage.setItem(LocalStorageKey.IsShowListOrGridAtMedia, "false")

        const { showListOrGridStatus } = useData()

        expect(showListOrGridStatus.value).toBe(false)
    })
})
