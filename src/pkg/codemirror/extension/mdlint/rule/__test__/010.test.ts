/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\rule\__test__\010.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 测试 rule010 - 检测 login-view 标签是否合法
 */

import { describe, expect, it } from "vitest"

import { run } from "../010"

type DocLike = Parameters<typeof run>[0]

const makeDoc = (lines: string[]): DocLike => {
    const offsets: number[] = [0]
    for (let i = 0; i < lines.length; i++) {
        offsets.push((offsets[i] ?? 0) + (lines[i] ?? "").length + 1)
    }

    return {
        lines: lines.length,
        line(i: number) {
            const text = lines[i - 1] ?? ""
            const from = offsets[i - 1] ?? 0
            return {
                from,
                to: from + text.length,
                text,
            }
        },
    }
}

describe("rule010", () => {
    it("正确的 login-view 标签不返回诊断", () => {
        const doc = makeDoc(["", "<login-view>", "隐藏内容", "</login-view>", ""])
        const diags = run(doc)

        expect(diags).toHaveLength(0)
    })

    it("缺少前后空行时应返回错误", () => {
        const doc = makeDoc(["前置内容", "<login-view>", "隐藏内容", "</login-view>", "后置内容"])
        const diags = run(doc)

        expect(diags.some((item) => item.message.includes("标签前应有空行"))).toBe(true)
        expect(diags.some((item) => item.message.includes("标签后应有空行"))).toBe(true)
    })

    it("未闭合标签应返回错误", () => {
        const doc = makeDoc(["", "<login-view>", "隐藏内容", ""])
        const diags = run(doc)

        expect(diags.some((item) => item.message.includes("标签未闭合"))).toBe(true)
    })

    it("不允许嵌套付费组件", () => {
        const doc = makeDoc(["", "<login-view>", "<pay-read>", "隐藏付费内容", "</pay-read>", "</login-view>", ""])
        const diags = run(doc)

        expect(diags.some((item) => item.message.includes("不允许嵌套自定义标签"))).toBe(true)
    })

    it("不允许嵌套其他自定义组件", () => {
        const doc = makeDoc(["", "<login-view>", '<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123"></power-bi>', "</login-view>", ""])
        const diags = run(doc)

        expect(diags.some((item) => item.message.includes("不允许嵌套自定义标签"))).toBe(true)
    })

    it("不允许嵌套同名标签", () => {
        const doc = makeDoc(["", "<login-view>", "<login-view>内容</login-view>", "</login-view>", ""])
        const diags = run(doc)

        expect(diags.some((item) => item.message.includes("不允许嵌套同名标签"))).toBe(true)
    })

    it("行内代码片段中的 login-view 标签不应触发 lint", () => {
        const doc = makeDoc(["- 示例：`<login-view>...</login-view>`"])
        const diags = run(doc)

        expect(diags).toHaveLength(0)
    })
})
