/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\service.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 测试 Markdown lint 保存前自动修复服务
 */

import { describe, expect, it } from "vitest"

import { autoFixMarkdownText, lintMarkdownText } from "./service"

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
        const result = autoFixMarkdownText(["", "<pay-read>", "<login-view>嵌套内容</login-view>", "</pay-read>", ""].join("\n"), {
            rules: markdownRules,
        })

        expect(result.fixedText).toContain("<login-view>嵌套内容</login-view>")
        expect(result.diagnostics.some((item) => item.message.includes("不允许嵌套自定义标签"))).toBe(true)
    })

    it("不会通过自动修复删除 power-bi 中作者编写的内容", () => {
        const result = autoFixMarkdownText(['<power-bi src="https://app.powerbi.com/reportEmbed?reportId=abc123">作者内容</power-bi>'].join("\n"), {
            rules: markdownRules,
        })

        expect(result.fixedText).toContain("作者内容")
        expect(result.diagnostics.some((item) => item.message.includes("标签内不应包含内容"))).toBe(true)
    })

    it("会自动修复 wechat-captcha 前后空行，但不会删除隐藏内容", () => {
        const source = [
            "前置内容",
            '<wechat-captcha name="焦棚子" codeurl="https://example.com/qrcode.png" key="1120" reply="demo148">',
            "隐藏内容",
            "</wechat-captcha>",
            "后置内容",
        ].join("\n")
        const result = autoFixMarkdownText(source, {
            rules: markdownRules,
        })

        expect(result.changed).toBe(true)
        expect(result.fixedText).toContain("隐藏内容")
        expect(result.fixedText).toContain("<wechat-captcha")
    })

    it("不会通过自动修复删除 wechat-captcha 中被禁止的付费组件", () => {
        const result = autoFixMarkdownText(
            [
                '<wechat-captcha name="焦棚子" codeurl="https://example.com/qrcode.png" key="1120" reply="demo148">',
                "<pay-read>",
                "隐藏付费内容",
                "</pay-read>",
                "</wechat-captcha>",
            ].join("\n"),
            {
                rules: markdownRules,
            },
        )

        expect(result.fixedText).toContain("<pay-read>")
        expect(result.diagnostics.some((item) => item.message.includes("不允许嵌套自定义标签"))).toBe(true)
    })

    it("会自动修复 login-view 标签前后空行", () => {
        const source = ["前置内容", "<login-view>", "</login-view>", "后置内容"].join("\n")
        const result = autoFixMarkdownText(source, { rules: markdownRules })

        expect(result.changed).toBe(true)
        expect(result.fixedText).toBe(["前置内容", "", "<login-view>", "", "</login-view>", "", "后置内容"].join("\n"))
        expect(result.diagnostics).toHaveLength(0)
    })

    it("仅移除行尾空格, 不影响其他内容", () => {
        const source = "第一行   \n第二行\t\t\n第三行"
        const result = autoFixMarkdownText(source, { rules: markdownRules })

        expect(result.changed).toBe(true)
        expect(result.fixedText).toBe("第一行\n第二行\n第三行")
    })

    it("不会格式化 fenced code block 中的空行, 标题和行尾空白", () => {
        const source = ["```bash", "", "# 1. 下载部署工具  ", "curl -fsSL -o blog-tool.sh https://example.com/tool.sh", "", "```"].join("\n")
        const result = autoFixMarkdownText(source, { rules: markdownRules })

        expect(result.changed).toBe(false)
        expect(result.fixedText).toBe(source)
    })

    it("不会对 fenced code block 内的内容执行 lint 校验", () => {
        const source = [
            "# 标题",
            "",
            "```bash",
            "# 1. 下载部署工具  ",
            "curl -fsSL -o blog-tool.sh https://gitee.com/jiaopengzi/blog-tool/raw/main/dist/blog-tool.sh",
            "### 伪标题",
            "```",
        ].join("\n")
        const result = lintMarkdownText(source)

        expect(result).toHaveLength(0)
    })

    it("已符合规范的文档不会产生变更", () => {
        const source = ["# 标题", "", "正文内容", "", '<pay-read id="abc123">', "", "付费内容", "", "</pay-read>", "", "结尾"].join("\n")
        const result = autoFixMarkdownText(source, { rules: markdownRules })

        expect(result.changed).toBe(false)
        expect(result.fixedText).toBe(source)
    })

    it("会折叠 pay-membership 空内容单行标签", () => {
        const source = ["", '<pay-membership id="m-1">', "", "</pay-membership>", ""].join("\n")
        const result = autoFixMarkdownText(source, { rules: markdownRules })

        expect(result.changed).toBe(true)
        expect(result.fixedText).toContain('<pay-membership id="m-1"></pay-membership>')
    })

    it("会折叠 pay-key 空内容单行标签", () => {
        const source = ["", '<pay-key id="k-1" title="标题">', "", "</pay-key>", ""].join("\n")
        const result = autoFixMarkdownText(source, { rules: markdownRules })

        expect(result.changed).toBe(true)
        expect(result.fixedText).toContain('<pay-key id="k-1" title="标题"></pay-key>')
    })

    it("会对复杂文档执行多轮修复", () => {
        const source = ["# 标题  ", "正文", '<video-player video-type="hls" id="v-1">', "", "</video-player>", "结尾行   "].join("\n")
        const result = autoFixMarkdownText(source, { rules: markdownRules })

        expect(result.changed).toBe(true)
        expect(result.fixedText).not.toMatch(/[ \t]+$/m)
        expect(result.fixedText).toContain('<video-player video-type="hls" id="v-1"></video-player>')
        expect(result.fixedText.includes("# 标题\n\n")).toBe(true)
    })
})
