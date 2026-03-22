/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\rule\__test__\008.test.ts
 * Author      : jiaopengzi
 * Description : 测试 rule008 - 检测 power-bi 标签是否合法
 */

import { describe, expect, it } from "vitest"

import type { DocLike } from "../../types"
import { run } from "../008"
import { makeDoc } from "./utils"

describe("rule008 - power-bi 标签合法性检测", () => {
    it("正确的 power-bi 标签带 src 属性不返回诊断", () => {
        const doc = makeDoc(['<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor="#ffffff"></power-bi>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("maskcolor 为空时不返回诊断", () => {
        const doc = makeDoc(['<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor=""></power-bi>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("maskcolor 为合法十六进制颜色值时不返回诊断", () => {
        const doc = makeDoc(['<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor="#abc123"></power-bi>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("maskcolor 非法时应返回 error", () => {
        const doc = makeDoc(['<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor="red"></power-bi>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags.length).toBeGreaterThan(0)
        expect(diags.some((item) => item.message.includes("maskcolor"))).toBe(true)
    })

    it("缺少 src 属性应返回 error", () => {
        const doc = makeDoc(["<power-bi></power-bi>"])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        const d1 = diags[0]!
        expect(d1.severity).toBe("error")
        expect(d1.message).toContain("src")
    })

    it("src 属性为空应返回 error", () => {
        const doc = makeDoc(['<power-bi src=""></power-bi>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(1)
        const d1 = diags[0]!
        expect(d1.severity).toBe("error")
        expect(d1.message).toContain("src")
    })

    it("未闭合的开始标签应返回 error", () => {
        const doc = makeDoc(['<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123">'])
        const diags = run(doc as unknown as DocLike)
        expect(diags.length).toBeGreaterThan(0)
        const hasClosingError = diags.some((d) => d.message.toLocaleLowerCase().includes("未闭合") || d.message.toLocaleLowerCase().includes("closing"))
        expect(hasClosingError).toBe(true)
    })

    it("多行 power-bi 标签应返回错误", () => {
        const doc = makeDoc(['<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123">', "", "</power-bi>"])
        const diags = run(doc as unknown as DocLike)
        expect(diags.length).toBeGreaterThan(0)
    })

    it("非 power-bi 标签不应触发此规则诊断", () => {
        const doc = makeDoc(['<video-player video-type="hls" id="m-1"></video-player>'])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("power-bi 标签前后有其他内容但 src 有效应返回相关错误", () => {
        const doc = makeDoc(['some text <power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor="#ffffff"></power-bi> more text'])
        const diags = run(doc as unknown as DocLike)
        // 内容环绕检查应报错
        expect(diags.length).toBeGreaterThan(0)
    })

    it("fenced code block 内的 power-bi 示例不应触发 lint", () => {
        const doc = makeDoc(["```html", "<power-bi></power-bi>", "```"])
        const diags = run(doc as unknown as DocLike)
        expect(diags).toHaveLength(0)
    })

    it("自闭合标签 power-bi 应返回错误", () => {
        const doc = makeDoc(['<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor="#ffffff" />'])
        const diags = run(doc as unknown as DocLike)
        // 自闭合不符合成对闭合要求
        expect(diags.length).toBeGreaterThan(0)
    })
})
