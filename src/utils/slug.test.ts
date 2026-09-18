/**
 * FilePath    : blog-client\src\utils\slug.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : slug 编码归一化工具的单元测试 (bugfix 260918-03)
 */

import { describe, expect, it } from "vitest"

import { decodeSlugFully, encodeSlugOnce } from "./slug"

// 构造指定层数的编码串: 对明文反复 encodeURIComponent N 次
const encodeTimes = (plain: string, times: number): string => {
    let value = plain
    for (let i = 0; i < times; i++) {
        value = encodeURIComponent(value)
    }
    return value
}

describe("decodeSlugFully 函数", () => {
    it("明文与空串原样返回", () => {
        expect(decodeSlugFully("")).toBe("")
        expect(decodeSlugFully("Tabular+Editor")).toBe("Tabular+Editor")
    })

    it("单层编码解码到明文", () => {
        expect(decodeSlugFully(encodeURIComponent("Tabular+Editor"))).toBe("Tabular+Editor")
        expect(decodeSlugFully(encodeURIComponent("分词"))).toBe("分词")
    })

    it("多层编码完全解码到明文 (生产日志实测 380 层形态)", () => {
        expect(decodeSlugFully(encodeTimes("Tabular+Editor", 380))).toBe("Tabular+Editor")
        expect(decodeSlugFully(encodeTimes("分词", 380))).toBe("分词")
    })

    it("畸形 % 序列保留当前值且不抛错", () => {
        // %zz 非法十六进制, decodeURIComponent 抛 URIError, 应保留原值
        expect(decodeSlugFully("100%")).toBe("100%")
        expect(decodeSlugFully("a%2zb")).toBe("a%2zb")
    })

    it("畸形序列与合法编码混合时解到畸形前为止", () => {
        // 外层合法 (%252B 解一层为 %2B), 内层 %2z 非法: 循环解到无法再解即止
        const mixed = encodeURIComponent("a%2zb")
        expect(decodeSlugFully(mixed)).toBe("a%2zb")
    })
})

describe("encodeSlugOnce 函数", () => {
    it("明文编码为单层形态", () => {
        expect(encodeSlugOnce("Tabular+Editor")).toBe("Tabular%2BEditor")
        expect(encodeSlugOnce("分词")).toBe(encodeURIComponent("分词"))
    })

    it("任意层数编码归一到单层形态", () => {
        expect(encodeSlugOnce(encodeTimes("Tabular+Editor", 1))).toBe("Tabular%2BEditor")
        expect(encodeSlugOnce(encodeTimes("Tabular+Editor", 286))).toBe("Tabular%2BEditor")
        expect(encodeSlugOnce(encodeTimes("分词", 380))).toBe(encodeURIComponent("分词"))
    })

    it("空串原样返回", () => {
        expect(encodeSlugOnce("")).toBe("")
    })
})
