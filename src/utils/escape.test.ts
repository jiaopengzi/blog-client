import { describe, expect, it } from "vitest"

import { escapeWhitespaceInHtmlContent } from "./escape"

describe("escapeWhitespaceInHtmlContent 的测试", () => {
    it("标签内部有换行符的情况", () => {
        const input = '<div class="a b"\nid="my-id">Hello world</div>'
        const out = escapeWhitespaceInHtmlContent(input)
        expect(out).toBe('<div class="a b"\nid="my-id">Hello&nbsp;world</div>')
    })

    it("标签内部有制表符的情况", () => {
        const input = `
        <div class="a b"
            id="my-id">Hello world</div>`
        const out = escapeWhitespaceInHtmlContent(input)
        expect(out).toBe(`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div class="a b"
            id="my-id">Hello&nbsp;world</div>`)
    })

    it("默认情况下转义文本节点中的空格，但不修改标签属性", () => {
        const input = '<div class="a b">Hello world</div>'
        const out = escapeWhitespaceInHtmlContent(input)
        expect(out).toBe('<div class="a b">Hello&nbsp;world</div>')
    })

    it("当 escapeSpaces 为 false 时不转义空格", () => {
        const input = "<p>foo bar baz</p>"
        const out = escapeWhitespaceInHtmlContent(input, { escapeSpaces: false })
        expect(out).toBe("<p>foo bar baz</p>")
    })

    it("当 escapeTabs 为 true 时将制表符转为 4 个 &nbsp;", () => {
        const input = "<pre>\tX\t</pre>"
        const out = escapeWhitespaceInHtmlContent(input, { escapeTabs: true })
        expect(out).toBe("<pre>&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;&nbsp;</pre>")
    })

    it("以正确顺序合并空格和制表符的转义", () => {
        const input = "<span> \t </span>"
        // 空格先转为 &nbsp;，然后制表符转为 4 个 &nbsp;，所以总共 6 个 &nbsp;
        const out = escapeWhitespaceInHtmlContent(input, { escapeSpaces: true, escapeTabs: true })
        expect(out).toBe("<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>")
    })

    it("处理开头/结尾为纯文本（无标签）的情况", () => {
        const input = "start end"
        const out = escapeWhitespaceInHtmlContent(input)
        expect(out).toBe("start&nbsp;end")
    })

    it("独立转义嵌套标签周围的文本节点", () => {
        const input = "<div>Hello <span>world</span>!</div>"
        const out = escapeWhitespaceInHtmlContent(input)
        expect(out).toBe("<div>Hello&nbsp;<span>world</span>!</div>")
    })

    it("不修改标签内的属性", () => {
        const input = '<input value="a b" />'
        const out = escapeWhitespaceInHtmlContent(input)
        expect(out).toBe('<input value="a b" />')
    })

    it("空字符串保持不变", () => {
        expect(escapeWhitespaceInHtmlContent("")).toBe("")
    })
})
