/*
 * FilePath    : blog-client-nuxt\src\utils\markdownRenderer.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : markdownRenderer 同构管线单测(阶段 4: 段落/锚点/去 H1/alert/XSS/代码高亮/自定义元素白名单/本地图片引用)
 */

import { describe, expect, it } from "vitest"

import { clearLocalImageUrls, registerLocalImageUrl } from "@/utils/mdLocalImage"
import { markdownToHtml, renderMarkdownDocument } from "@/utils/markdownRenderer"

describe("markdownRenderer 同构管线", () => {
    it("1. 段落：markdown 段落渲染为 <p> 文本", () => {
        const html = markdownToHtml("# 标题\n\n这是第一段内容。\n\n这是第二段内容。", false)
        expect(html).toContain("<p>这是第一段内容。</p>")
        expect(html).toContain("这是第二段内容")
    })

    it("2. 锚点：标题自动生成 id 锚点（中文保留）", () => {
        const html = markdownToHtml("## 二级标题", false)
        expect(html).toContain("idx0-二级标题")
    })

    it("3. 去首 H1：isRemoveFirstH1=true 时移除第一个 H1", () => {
        const html = markdownToHtml("# 一级标题\n\n正文内容", true)
        expect(html).not.toContain("<h1")
        expect(html).toContain("正文内容")
    })

    it("4. alert 续块：紧跟 alert 的引用列表合并在同一提示容器中", () => {
        const src = "> [!TIP]\n> 提示内容\n>\n> - 续写条目1\n> - 续写条目2"
        const html = markdownToHtml(src, false)
        expect(html).toContain("markdown-alert")
        expect(html).toContain("提示内容")
        expect(html).toContain("续写条目1")
        expect(html).toContain("续写条目2")
    })

    it("5. XSS：script/onerror/javascript 链接被 sanitize 移除", () => {
        const src = "<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[点我](javascript:alert(1))"
        const html = markdownToHtml(src, false)
        expect(html).not.toContain("<script")
        expect(html).not.toContain("onerror")
        expect(html).not.toContain("javascript:")
    })

    it("6. 代码块高亮：js 代码块带高亮 class", () => {
        const html = markdownToHtml("```js\nconst a = 1\n```", false)
        expect(html).toContain("hljs")
        expect(html).toContain("language-js")
    })

    it("7. 自定义元素白名单：pay-read/video-player 保留，未知元素剥离", () => {
        const src = '<pay-read></pay-read>\n\n<video-player video-type="hls" id="m-1"></video-player>\n\n<evil-tag>bad</evil-tag>'
        const html = markdownToHtml(src, false)
        expect(html).toContain("<pay-read")
        expect(html).toContain("<video-player")
        expect(html).not.toContain("<evil-tag")
    })

    it("8. 本地图片引用：md-img 协议通过 sanitize，未注册时渲染为透明占位", () => {
        const html = markdownToHtml("![本地图](md-img:0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d)", false)
        expect(html).toContain("data:image/gif;base64,")
        expect(html).not.toContain('src="md-img:')
    })

    it("9. 本地图片引用：已注册时渲染为注册表中的 blob URL", () => {
        registerLocalImageUrl("0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d", "blob:http://127.0.0.1:7364/fake-a")
        try {
            const html = markdownToHtml("![本地图](md-img:0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d)", false)
            expect(html).toContain('src="blob:http://127.0.0.1:7364/fake-a"')
        } finally {
            clearLocalImageUrls()
        }
    })

    it("补充：SSR 与客户端同一实现（renderMarkdownDocument 双端一致）", () => {
        const src = "## 标题\n\n正文段落"
        const result = renderMarkdownDocument(src, false)
        expect(result.html).toContain("正文段落")
        expect(result.tocHtml.length).toBeGreaterThan(0)
        expect(result.tocHtml[0]!.text).toContain("标题")
    })
})
