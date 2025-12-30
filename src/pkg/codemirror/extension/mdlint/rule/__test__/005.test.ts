/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\rule\__test__\005.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 测试 rule005 - 检测付费标签是否合法
 */

import { describe, expect, it } from "vitest"

import type { DocLike } from "../../types"
import { run } from "../005"
import { makeDoc } from "./utils"

// 测试规则 005: 检测付费标签是否合法
describe("rule005 - 付费标签合法性检测", () => {
    it("正确的 pay-read 块不返回诊断", () => {
        const doc = makeDoc(["pre", "", "<pay-read>", "secret", "</pay-read>", "", "post"])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("未闭合的开始标签应返回 error", () => {
        const doc = makeDoc(["<pay-read>"])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        const d1 = diags[0]!
        expect(d1.severity).toBe("error")
        expect(d1.message).toContain("标签未闭合")
    })

    it("pay-key 缺少 id 属性应报错", () => {
        const doc = makeDoc(['<pay-key title="t"></pay-key>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        const d2 = diags[0]!
        expect(d2.message).toBe("标签缺少属性: id")
        expect(d2.severity).toBe("error")
    })

    it("pay-key 单行内包含内容应报错", () => {
        const doc = makeDoc(['<pay-key id="1">content</pay-key>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        const d3 = diags[0]!
        expect(d3.severity).toBe("error")
        expect(d3.message).toContain("内不应包含内容")
    })

    it("pay-membership 多行时应报错为单行要求", () => {
        const doc = makeDoc(["<pay-membership>", "", "</pay-membership>"])
        const diags = run(doc as unknown as DocLike)
        // 期望至少有一条关于单行要求的错误
        expect(diags.some((d) => d.message.includes("应为单行"))).toBe(true)
    })

    it("标签嵌套顺序错误应报错", () => {
        const doc = makeDoc(["<pay-read>", '<pay-key id="1">', "</pay-read>", "</pay-key>"])
        const diags = run(doc as unknown as DocLike)
        // 应在遇到错误闭合时报告一个错误
        expect(diags.some((d) => d.message.includes("未闭合或顺序错误"))).toBe(true)
    })

    it("block 标签前后缺少空行应报错", () => {
        const doc = makeDoc(["pre", "<pay-read>", "secret", "</pay-read>", "post"])
        const diags = run(doc as unknown as DocLike)
        // 期望关于前后空行的错误存在
        expect(diags.some((d) => d.message.includes("前应有空行"))).toBe(true)
        expect(diags.some((d) => d.message.includes("后应有空行"))).toBe(true)
    })

    it("开始标签前有内容应报错", () => {
        const doc = makeDoc(["pre <pay-read>", "secret", "</pay-read>"])
        const diags = run(doc as unknown as DocLike)
        expect(diags.some((d) => d.message.includes("标签前不应有内容"))).toBe(true)
    })

    it("结束标签后有内容应报错", () => {
        const doc = makeDoc(["<pay-read>", "secret", "</pay-read> post"])
        const diags = run(doc as unknown as DocLike)
        expect(diags.some((d) => d.message.includes("标签后不应有内容"))).toBe(true)
    })
})
