import type { Tokens } from "marked"

import { describe, expect, it } from "vitest"

import { renderer } from "../renderer"

describe("renderer.code - 代码块渲染", () => {
    it("c# 语言代码块应正确渲染, 不泄漏到代码块外", () => {
        const result = renderer.code({ text: "var x = 1;", lang: "c#", escaped: false } as Tokens.Code)

        expect(result).toContain('class="copy-button"> C#</button>')
        expect(result).toContain('language-c#')
        expect(result).toContain('data-lang=" c#"')
        expect(result).toContain('<code>var&nbsp;x&nbsp;=&nbsp;1;</code>')
    })

    it("javascript 语言代码块应正确渲染", () => {
        const result = renderer.code({ text: "console.log(1)", lang: "javascript", escaped: false } as Tokens.Code)

        expect(result).toContain("JAVASCRIPT")
        expect(result).toContain('language-javascript')
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
        expect(result).toContain('language-c++')
        expect(result).toContain('data-lang=" c++"')
    })
})
