/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\rule\__test__\007.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 测试 rule007 - 标题行前后必须有空行
 */

import { describe, expect, it } from "vitest"

import type { DocLike } from "../../types"
import { id, run } from "../007"
import { makeDoc } from "./utils"

describe("rule007 - 标题行前后必须有空行", () => {
    it("前后都有空行时不返回 diagnostic", () => {
        const doc = makeDoc(["", "# H1", ""]) // 前后均为空行
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("缺少后空行应返回 warning", () => {
        const doc = makeDoc(["# A", "B"]) // 标题在文件开头, 后面非空
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        const d = diags[0]!
        expect(d.severity).toBe("warning")
        expect(d.from).toBe(0)
        expect(d.to).toBe(1) // '#' 长度 1
        expect(d.source).toBe(id)
    })

    it("缺少前空行应返回 warning", () => {
        const doc = makeDoc(["A", "# B"]) // 标题前一行为非空
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        const d = diags[0]!
        expect(d.severity).toBe("warning")
        expect(d.from).toBe(1) // 第一行长度 1
        expect(d.to).toBe(2) // from + '#' 长度 1
        expect(d.source).toBe(id)
    })

    it("前后均缺少空行应返回两个 warning", () => {
        const doc = makeDoc(["A", "## B", "C"]) // 标题前后均为非空
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(2)
        expect(diags.every((x) => x.severity === "warning")).toBeTruthy()
        expect(diags.every((x) => x.source === id)).toBeTruthy()
    })
})
