/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\rule\__test__\003.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 测试 rule002 - 检测行长度超过指定阈值
 */

import { describe, expect, it } from "vitest"

import type { DocLike } from "../../types"
import { id, run } from "../003"
import { makeDoc } from "./utils"

// 测试规则 003: 检测标题级别跳跃
describe("rule003 - 标题级别跳跃检测", () => {
    it("连续级别增加不视为跳跃", () => {
        const doc = makeDoc(["# H1", "## H2", "### H3"])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("从 H1 直接跳到 H3 应返回 warning", () => {
        const doc = makeDoc(["# A", "### B"]) // 第一行长度 3, 第二行从 3 开始
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        const d = diags[0]!
        expect(d.severity).toBe("warning")
        expect(d.from).toBe(3)
        expect(d.to).toBe(6) // '###' 长度 3
        expect(d.source).toBe(id)
    })
})
