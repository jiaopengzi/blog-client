/**
 * FilePath    : blog-client\src\components\editor\utils\css-shorthand.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : CSS 简写展开模块测试
 */

import { describe, expect, it } from "vitest"

import { normalizeValue } from "./css-shorthand"

describe("normalizeValue", () => {
    it("将接近整数的 px 值取整（0 以下不取整，避免丢失有意的小数边框）", () => {
        expect(normalizeValue("border-bottom-width", "1.81818px")).toBe("2px")
        expect(normalizeValue("border-bottom-width", "0.909091px")).toBe("1px")
        expect(normalizeValue("border-bottom-width", "1.5px")).toBe("2px")
        expect(normalizeValue("border-bottom-width", "2.3px")).toBe("2px")
        expect(normalizeValue("border-bottom-width", "3.7px")).toBe("4px")
    })

    it("取整到 0 的边界值保持原样", () => {
        expect(normalizeValue("border-bottom-width", "0.4px")).toBe("0.4px")
        expect(normalizeValue("border-bottom-width", "0.2px")).toBe("0.2px")
    })

    it("整数 px 值保持不变", () => {
        expect(normalizeValue("border-bottom-width", "0px")).toBe("0px")
        expect(normalizeValue("border-bottom-width", "1px")).toBe("1px")
        expect(normalizeValue("border-bottom-width", "2px")).toBe("2px")
        expect(normalizeValue("border-bottom-width", "10px")).toBe("10px")
    })

    it("非 px 单位原样返回", () => {
        expect(normalizeValue("border-bottom-width", "0.5em")).toBe("0.5em")
        expect(normalizeValue("border-bottom-width", "1rem")).toBe("1rem")
        expect(normalizeValue("border-bottom-width", "thin")).toBe("thin")
        expect(normalizeValue("border-bottom-width", "medium")).toBe("medium")
        expect(normalizeValue("border-bottom-width", "")).toBe("")
    })

    it("零值保持原样", () => {
        expect(normalizeValue("border-bottom-width", "0px")).toBe("0px")
    })
})
