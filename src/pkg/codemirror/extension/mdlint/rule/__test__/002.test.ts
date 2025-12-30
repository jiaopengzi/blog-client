/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\rule\__test__\002.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 测试 rule002 - 检测行长度超过指定阈值
 */

import { describe, expect, it } from "vitest"

import type { DocLike } from "../../types"
import { id, run } from "../002"
import { makeDoc } from "./utils"

// 测试规则 002: 检测行长度超过指定阈值
describe("rule002 - 检测行长度限制", () => {
    it("不超过默认长度时不返回诊断", () => {
        const doc = makeDoc(["short", "ok"])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("当指定 maxLineLength 时能检测到超长行", () => {
        // 使用较小的阈值便于测试
        const doc = makeDoc(["hello!!"]) // 长度 7
        const diags = run(doc as unknown as DocLike, { maxLineLength: 5 })
        expect(diags).toHaveLength(1)
        expect(diags[0]).toEqual({
            from: 5,
            to: 7,
            severity: "warning",
            message: "行长度超过 5 字符",
            source: id,
        })
    })

    it("检测到多行超长的情况", () => {
        const doc = makeDoc(["123456", "a", "abcdefg"]) // lengths 6,1,7
        const diags = run(doc as unknown as DocLike, { maxLineLength: 3 })
        expect(diags).toHaveLength(2)
    })
})

export default {}
