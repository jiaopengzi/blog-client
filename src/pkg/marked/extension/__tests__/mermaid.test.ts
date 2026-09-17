/**
 * FilePath    : blog-client\src\pkg\marked\extension\__tests__\mermaid.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : mermaid 代码块占位容器渲染测试 (260917-01)
 */

import type { Tokens } from "marked"

import { describe, expect, it } from "vitest"

import createMarked from "@/pkg/marked/new-marked"
import { renderMarkdownDocument } from "@/utils/markdownRenderer"

import { renderer } from "../renderer"

describe("renderer.code - mermaid 占位容器", () => {
    it("mermaid 代码块输出占位容器与源码复制按钮, 不进 hljs 代码块结构", () => {
        const result = renderer.code({ text: "flowchart LR\n    A --> B", lang: "mermaid", escaped: false } as Tokens.Code)

        expect(result).toContain('<section class="jpz-mermaid-container" data-mermaid-status="pending">')
        expect(result).toContain('<button type="button" class="copy-button jpz-mermaid-copy-button">MERMAID</button>')
        expect(result).toContain('<pre class="jpz-mermaid-source">flowchart LR\n    A --&gt; B</pre>')
        expect(result).not.toContain("pre-code-container")
    })

    it("源码中的 html 尖括号与 & 被转义", () => {
        const result = renderer.code({ text: "A[<b>加粗</b> & more]", lang: "mermaid", escaped: false } as Tokens.Code)

        expect(result).toContain("&lt;b&gt;加粗&lt;/b&gt; &amp; more")
    })

    it("已转义源码不再二次转义", () => {
        const result = renderer.code({ text: "A --&gt; B", lang: "mermaid", escaped: true } as Tokens.Code)

        expect(result).toContain("A --&gt; B")
        expect(result).not.toContain("&amp;gt;")
    })

    it("lang 首单词后的附加信息不影响 mermaid 识别", () => {
        const result = renderer.code({ text: "flowchart TD", lang: "mermaid title=测试", escaped: false } as Tokens.Code)

        expect(result).toContain("jpz-mermaid-container")
    })

    it("普通语言代码块不受 mermaid 分支影响", () => {
        const result = renderer.code({ text: "console.log(1)", lang: "javascript", escaped: false } as Tokens.Code)

        expect(result).toContain("pre-code-container")
        expect(result).not.toContain("jpz-mermaid")
    })
})

describe("mermaid 占位容器 - 全链路", () => {
    it("marked 全管线解析 mermaid 围栏输出占位容器", () => {
        const html = createMarked().parse("```mermaid\nflowchart LR\n    A --> B\n```").toString()

        expect(html).toContain('class="jpz-mermaid-container"')
        expect(html).toContain('class="jpz-mermaid-source"')
        expect(html).toContain('data-mermaid-status="pending"')
    })

    it("renderMarkdownDocument sanitize 后占位容器与转义源码存活", () => {
        const { html } = renderMarkdownDocument("```mermaid\nflowchart LR\n    A[x <y> & z] --> B\n```", false)

        // 占位结构存活 (data-* 属性默认放行)
        expect(html).toContain('data-mermaid-status="pending"')
        expect(html).toContain('class="jpz-mermaid-source"')
        // 源码复制按钮存活 (button 在 DOMPurify 默认白名单内, 与代码块 copy-button 同通道)
        expect(html).toContain('class="copy-button jpz-mermaid-copy-button"')
        // 源码被转义, 无原生标签泄漏
        expect(html).toContain("&lt;y&gt;")
        expect(html).not.toContain("<y>")
    })
})
