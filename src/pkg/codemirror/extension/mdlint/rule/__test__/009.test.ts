/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\rule\__test__\009.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 测试 rule009 - 检测 wechat-captcha 标签是否合法
 */

import { describe, expect, it } from "vitest"

import { run } from "../009"

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

describe("rule009", () => {
    it("正确的 wechat-captcha 标签不返回诊断", () => {
        const doc = makeDoc([
            "",
            '<wechat-captcha name="焦棚子" codeurl="https://example.com/qrcode.png" key="1120" reply="demo148">',
            "隐藏内容",
            "</wechat-captcha>",
            "",
        ])
        const diags = run(doc)

        expect(diags).toHaveLength(0)
    })

    it("缺少必填属性时应返回错误", () => {
        const doc = makeDoc(["", '<wechat-captcha name="焦棚子" codeurl="" key="1120" reply="demo148">', "隐藏内容", "</wechat-captcha>", ""])
        const diags = run(doc)

        expect(diags.some((item) => item.message.includes("codeurl"))).toBe(true)
    })

    it("缺少前后空行时应返回错误", () => {
        const doc = makeDoc([
            "前置内容",
            '<wechat-captcha name="焦棚子" codeurl="https://example.com/qrcode.png" key="1120" reply="demo148">',
            "隐藏内容",
            "</wechat-captcha>",
            "后置内容",
        ])
        const diags = run(doc)

        expect(diags.some((item) => item.message.includes("标签前应有空行"))).toBe(true)
        expect(diags.some((item) => item.message.includes("标签后应有空行"))).toBe(true)
    })

    it("允许嵌套其他自定义组件", () => {
        const doc = makeDoc([
            "",
            '<wechat-captcha name="焦棚子" codeurl="https://example.com/qrcode.png" key="1120" reply="demo148">',
            '<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123"></power-bi>',
            "</wechat-captcha>",
            "",
        ])
        const diags = run(doc)

        expect(diags.some((item) => item.message.includes("不允许嵌套同名标签"))).toBe(false)
    })

    it("不允许嵌套同名标签", () => {
        const doc = makeDoc([
            "",
            '<wechat-captcha name="焦棚子" codeurl="https://example.com/qrcode.png" key="1120" reply="demo148">',
            '<wechat-captcha name="子级" codeurl="https://example.com/child.png" key="2233" reply="child">子级内容</wechat-captcha>',
            "</wechat-captcha>",
            "",
        ])
        const diags = run(doc)

        expect(diags.some((item) => item.message.includes("不允许嵌套同名标签"))).toBe(true)
    })
})
