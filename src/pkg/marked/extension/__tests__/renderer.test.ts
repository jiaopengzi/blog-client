/**
 * FilePath    : blog-client\src\pkg\marked\extension\__tests__\renderer.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : renderer 渲染器测试
 */

import type { Tokens } from "marked"

import { afterEach, describe, expect, it } from "vitest"

import { ImageCaptionFormat, renderer, setImageCaptionFormat } from "../renderer"

describe("renderer.code - 代码块渲染", () => {
    it("c# 语言代码块应正确渲染, 不泄漏到代码块外", () => {
        const result = renderer.code({ text: "var x = 1;", lang: "c#", escaped: false } as Tokens.Code)

        expect(result).toContain('class="copy-button"> C#</button>')
        expect(result).toContain("language-c#")
        expect(result).toContain('data-lang=" c#"')
        expect(result).toContain("<code>var&nbsp;x&nbsp;=&nbsp;1;</code>")
    })

    it("javascript 语言代码块应正确渲染", () => {
        const result = renderer.code({ text: "console.log(1)", lang: "javascript", escaped: false } as Tokens.Code)

        expect(result).toContain("JAVASCRIPT")
        expect(result).toContain("language-javascript")
        expect(result).toContain('data-lang=" javascript"')
    })

    it("无语言标识的代码块应正确渲染", () => {
        const result = renderer.code({ text: "hello world", lang: "", escaped: false } as Tokens.Code)

        expect(result).toContain("TEXT")
        expect(result).toContain("<code>")
    })

    it("c++ 语言代码块应正确渲染", () => {
        const result = renderer.code({ text: "int main() {}", lang: "c++", escaped: false } as Tokens.Code)

        expect(result).toContain("C++")
        expect(result).toContain("language-c++")
        expect(result).toContain('data-lang=" c++"')
    })

    it("会保留代码块中的首行空行和中间空行", () => {
        const result = renderer.code({ text: "\nfirst line\n\nthird line", lang: "bash", escaped: false } as Tokens.Code)

        expect(result.match(/<code\b/g)).toHaveLength(4)
        expect(result).toContain('<code data-empty-line="true">&nbsp;</code>')
        expect(result).toContain("<code>first&nbsp;line</code>")
        expect(result).toContain("<code>third&nbsp;line</code>")
    })
})

describe("renderer.image - 图注格式", () => {
    afterEach(() => {
        document.body.className = ""
        setImageCaptionFormat(ImageCaptionFormat.Alt)
    })

    it("非 /md 页面默认使用 alt 作为图注", () => {
        const result = renderer.image({ href: "/demo.png", text: "示例图片", title: "" } as Tokens.Image)

        expect(result).toContain("jpz-image-caption")
        expect(result).toContain("示例图片")
    })

    it("/md 页面支持 alt 图注", () => {
        document.body.classList.add("md-page-route")
        setImageCaptionFormat(ImageCaptionFormat.Alt)

        const result = renderer.image({ href: "/demo.png", text: "示例图片", title: "" } as Tokens.Image)

        expect(result).toContain("jpz-image-caption")
        expect(result).toContain("示例图片")
    })

    it("/md 页面支持文件名图注", () => {
        document.body.classList.add("md-page-route")
        setImageCaptionFormat(ImageCaptionFormat.Filename)

        const result = renderer.image({ href: "https://example.com/path/demo-image.png?x=1", text: "", title: "" } as Tokens.Image)

        expect(result).toContain('<figcaption class="jpz-image-caption">demo-image</figcaption>')
    })

    it("/md 页面支持不显示图注", () => {
        document.body.classList.add("md-page-route")
        setImageCaptionFormat(ImageCaptionFormat.None)

        const result = renderer.image({ href: "/demo.png", text: "示例图片", title: "" } as Tokens.Image)

        expect(result).toContain("jpz-image-figure--no-caption")
        expect(result).not.toContain("jpz-image-caption")
    })
})
