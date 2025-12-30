/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\rule\__test__\001.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 测试 rule001 - 检测行尾多余空格
 */

import { describe, expect, it } from "vitest"

import type { DocLike } from "../../types"
import { id, run } from "../001"
import { makeDoc } from "./utils"

describe("rule001 - 检测行尾多余空格", () => {
    it("无多余空格时不返回诊断", () => {
        const doc = makeDoc(["abc", "def", ""])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("检测到单行末尾多余空格", () => {
        const doc = makeDoc(["hello  "]) // 两个尾随空格
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        expect(diags[0]).toEqual({
            from: 5, // "hello" 的长度
            to: 7, // 包含两个空格
            severity: "warning",
            message: "行尾存在多余空格",
            source: id,
        })
    })

    it("检测到多行末尾多余空格", () => {
        const doc = makeDoc(["a ", "b", "c   "]) // line1 和 line3 有尾随空格
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(2)
        expect(diags).toContainEqual({
            from: 1, // "a" 的长度
            to: 2, // 包含一个空格
            severity: "warning",
            message: "行尾存在多余空格",
            source: id,
        })

        // for line 3: cumulative to = len("a ") + len("b") + len("c   ") = 2+1+4 = 7, trailing len 3 -> from 4 to 7
        expect(diags).toContainEqual({
            from: 4,
            to: 7,
            severity: "warning",
            message: "行尾存在多余空格",
            source: id,
        })
    })

    it("检测到仅由空格组成的行", () => {
        const doc = makeDoc(["   ", "x"])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        expect(diags[0]).toEqual({
            from: 0,
            to: 3,
            severity: "warning",
            message: "行尾存在多余空格",
            source: id,
        })
    })
})
