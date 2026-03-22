/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\service.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 测试 Markdown lint 保存前自动修复服务
 */

import { describe, expect, it } from "vitest"

import { autoFixMarkdownText } from "./service"

const markdownRules = {
    rule002: false,
    rule003: false,
}

describe("mdlint service", () => {
    it("会自动修复标题空行和行尾空格", () => {
        const result = autoFixMarkdownText("# 标题  \n正文", {
            rules: markdownRules,
        })

        expect(result.changed).toBe(true)
        expect(result.fixedText).toBe("# 标题\n\n正文")
        expect(result.diagnostics).toHaveLength(0)
    })

    it("会自动修复付费标签和 video-player 周围空行, 并折叠空内容单行标签", () => {
        const source = ["前置内容", '<video-player video-type="hls" id="m-1">', "", "</video-player>", "后置内容"].join("\n")
        const result = autoFixMarkdownText(source, {
            rules: markdownRules,
        })

        expect(result.changed).toBe(true)
        expect(result.fixedText).toBe(["前置内容", "", '<video-player video-type="hls" id="m-1"></video-player>', "", "后置内容"].join("\n"))
        expect(result.diagnostics).toHaveLength(0)
    })

    it("会自动修复 power-bi 周围空行, 并折叠空内容单行标签", () => {
        const source = [
            "前置内容",
            '<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor="#ffffff">',
            "",
            "</power-bi>",
            "后置内容",
        ].join("\n")
        const result = autoFixMarkdownText(source, {
            rules: markdownRules,
        })

        expect(result.changed).toBe(true)
        expect(result.fixedText).toBe(
            ["前置内容", "", '<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123" maskcolor="#ffffff"></power-bi>', "", "后置内容"].join("\n"),
        )
        expect(result.diagnostics).toHaveLength(0)
    })

    it("无法自动修复缺少关键属性的问题", () => {
        const result = autoFixMarkdownText('<pay-key title="标题"></pay-key>', {
            rules: markdownRules,
        })

        expect(result.changed).toBe(false)
        expect(result.diagnostics).toHaveLength(1)
        expect(result.diagnostics[0]?.message).toBe("标签缺少属性: id")
    })

    it("不会通过自动修复消除自定义标签嵌套问题", () => {
        const result = autoFixMarkdownText(["", "<pay-read>", '<video-player video-type="hls" id="m-1"></video-player>', "</pay-read>", ""].join("\n"), {
            rules: markdownRules,
        })

        expect(result.fixedText).toContain('<video-player video-type="hls" id="m-1"></video-player>')
        expect(result.diagnostics.some((item) => item.message.includes("不允许嵌套自定义标签"))).toBe(true)
    })

    it("不会通过自动修复删除 power-bi 中作者编写的内容", () => {
        const result = autoFixMarkdownText(['<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123">作者内容</power-bi>'].join("\n"), {
            rules: markdownRules,
        })

        expect(result.fixedText).toContain("作者内容")
        expect(result.diagnostics.some((item) => item.message.includes("标签内不应包含内容"))).toBe(true)
    })
})
