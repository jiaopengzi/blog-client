/**
 * @FilePath     : \blog-client\src\components\editor\core\utils.test.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 测试工具函数
 */

import { describe, expect, it } from "vitest"

import { anchorGenerator, createRegexCache, generateAllHeadingAnchor } from "./utils"

describe("createRegexCache", () => {
    it("缓存中的正则匹配", () => {
        const regexCache = createRegexCache()

        expect(regexCache.hTagRegex).toEqual(/<h\d.*?>.*?<\/h\d>/g)
        expect(regexCache.hTagLevelRegex).toEqual(/<h(\d).*?>/)
        expect(regexCache.hTagAnchorRegex).toEqual(/id="(.*)"/)
        expect(regexCache.htmlTagRegex).toEqual(/<.*?>/g)
        expect(regexCache.markdownHeadingRegex).toEqual(/^\s{0,3}(#{1,6})\s+(.*)(?:\n+|$)/gm)
    })

    it("匹配 h 标签", () => {
        const { hTagRegex } = createRegexCache()
        const html = "<h1>Title</h1><h2>Subtitle</h2>"
        const matches = html.match(hTagRegex)
        expect(matches).toEqual(["<h1>Title</h1>", "<h2>Subtitle</h2>"])
    })

    it("匹配 h 标签的等级", () => {
        const { hTagLevelRegex } = createRegexCache()
        const hTag = "<h2>Subtitle</h2>"
        const match = hTag.match(hTagLevelRegex)
        expect(match?.[0]).toEqual("<h2>")
        expect(match?.[1]).toEqual("2")
    })

    it("匹配 h 标签的锚点", () => {
        const { hTagAnchorRegex } = createRegexCache()
        const hTag = '<h2 id="subtitle">Subtitle</h2>'
        const match = hTag.match(hTagAnchorRegex)
        expect(match?.[0]).toEqual('id="subtitle"')
        expect(match?.[1]).toEqual("subtitle")
    })

    it("匹配所有 HTML 标签", () => {
        const { htmlTagRegex } = createRegexCache()
        const html = "<div><p>Paragraph</p></div>"
        const matches = html.match(htmlTagRegex)
        expect(matches).toEqual(["<div>", "<p>", "</p>", "</div>"])
    })

    it("匹配 markdown 标题", () => {
        const { markdownHeadingRegex } = createRegexCache()
        const markdown = "# Heading 1\n ## Heading 2\n### Heading 3"
        const matches = [...markdown.matchAll(markdownHeadingRegex)]
        expect(matches.map((match) => [match[0], match[1], match[2]])).toEqual([
            ["# Heading 1\n", "#", "Heading 1"],
            [" ## Heading 2\n", "##", "Heading 2"], // 行首有空格
            ["### Heading 3", "###", "Heading 3"],
        ])
    })
})

describe("createRegexCache", () => {
    it("缓存中的正则匹配", () => {
        const regexCache = createRegexCache()

        expect(regexCache.hTagRegex).toEqual(/<h\d.*?>.*?<\/h\d>/g)
        expect(regexCache.hTagLevelRegex).toEqual(/<h(\d).*?>/)
        expect(regexCache.hTagAnchorRegex).toEqual(/id="(.*)"/)
        expect(regexCache.htmlTagRegex).toEqual(/<.*?>/g)
        expect(regexCache.markdownHeadingRegex).toEqual(/^\s{0,3}(#{1,6})\s+(.*)(?:\n+|$)/gm)
    })

    it("匹配 h 标签", () => {
        const { hTagRegex } = createRegexCache()
        const html = "<h1>Title</h1><h2>Subtitle</h2>"
        const matches = html.match(hTagRegex)
        expect(matches).toEqual(["<h1>Title</h1>", "<h2>Subtitle</h2>"])
    })

    it("匹配 h 标签的等级", () => {
        const { hTagLevelRegex } = createRegexCache()
        const hTag = "<h2>Subtitle</h2>"
        const match = hTag.match(hTagLevelRegex)
        expect(match?.[0]).toEqual("<h2>")
        expect(match?.[1]).toEqual("2")
    })

    it("匹配 h 标签的锚点", () => {
        const { hTagAnchorRegex } = createRegexCache()
        const hTag = '<h2 id="subtitle">Subtitle</h2>'
        const match = hTag.match(hTagAnchorRegex)
        expect(match?.[0]).toEqual('id="subtitle"')
        expect(match?.[1]).toEqual("subtitle")
    })

    it("匹配所有 HTML 标签", () => {
        const { htmlTagRegex } = createRegexCache()
        const html = "<div><p>Paragraph</p></div>"
        const matches = html.match(htmlTagRegex)
        expect(matches).toEqual(["<div>", "<p>", "</p>", "</div>"])
    })

    it("匹配 markdown 标题", () => {
        const { markdownHeadingRegex } = createRegexCache()
        const markdown = "# Heading 1\n ## Heading 2\n### Heading 3"
        const matches = [...markdown.matchAll(markdownHeadingRegex)]
        expect(matches.map((match) => [match[0], match[1], match[2]])).toEqual([
            ["# Heading 1\n", "#", "Heading 1"],
            [" ## Heading 2\n", "##", "Heading 2"], // 行首有空格
            ["### Heading 3", "###", "Heading 3"],
        ])
    })
})

describe("anchorGenerator", () => {
    it("生成正确的锚点", () => {
        expect(anchorGenerator("标题 123")).toEqual("标题-123")
        expect(anchorGenerator("Hello World!")).toEqual("hello-world")
        expect(anchorGenerator("Multiple   Spaces")).toEqual("multiple-spaces")
        expect(anchorGenerator("Special@#&*Characters")).toEqual("special-characters")
        expect(anchorGenerator("中文标题")).toEqual("中文标题")
    })

    it("处理连续的 - 符号", () => {
        expect(anchorGenerator("Hello--World")).toEqual("hello-world")
        expect(anchorGenerator("Multiple---Dashes")).toEqual("multiple-dashes")
    })

    it("去除首尾的 - 符号", () => {
        expect(anchorGenerator("-Hello-World-")).toEqual("hello-world")
        expect(anchorGenerator("--Multiple-Dashes--")).toEqual("multiple-dashes")
    })
})

describe("createRegexCache", () => {
    it("缓存中的正则匹配", () => {
        const regexCache = createRegexCache()

        expect(regexCache.hTagRegex).toEqual(/<h\d.*?>.*?<\/h\d>/g)
        expect(regexCache.hTagLevelRegex).toEqual(/<h(\d).*?>/)
        expect(regexCache.hTagAnchorRegex).toEqual(/id="(.*)"/)
        expect(regexCache.htmlTagRegex).toEqual(/<.*?>/g)
        expect(regexCache.markdownHeadingRegex).toEqual(/^\s{0,3}(#{1,6})\s+(.*)(?:\n+|$)/gm)
    })

    it("匹配 h 标签", () => {
        const { hTagRegex } = createRegexCache()
        const html = "<h1>Title</h1><h2>Subtitle</h2>"
        const matches = html.match(hTagRegex)
        expect(matches).toEqual(["<h1>Title</h1>", "<h2>Subtitle</h2>"])
    })

    it("匹配 h 标签的等级", () => {
        const { hTagLevelRegex } = createRegexCache()
        const hTag = "<h2>Subtitle</h2>"
        const match = hTag.match(hTagLevelRegex)
        expect(match?.[0]).toEqual("<h2>")
        expect(match?.[1]).toEqual("2")
    })

    it("匹配 h 标签的锚点", () => {
        const { hTagAnchorRegex } = createRegexCache()
        const hTag = '<h2 id="subtitle">Subtitle</h2>'
        const match = hTag.match(hTagAnchorRegex)
        expect(match?.[0]).toEqual('id="subtitle"')
        expect(match?.[1]).toEqual("subtitle")
    })

    it("匹配所有 HTML 标签", () => {
        const { htmlTagRegex } = createRegexCache()
        const html = "<div><p>Paragraph</p></div>"
        const matches = html.match(htmlTagRegex)
        expect(matches).toEqual(["<div>", "<p>", "</p>", "</div>"])
    })

    it("匹配 markdown 标题", () => {
        const { markdownHeadingRegex } = createRegexCache()
        const markdown = "# Heading 1\n ## Heading 2\n### Heading 3"
        const matches = [...markdown.matchAll(markdownHeadingRegex)]
        expect(matches.map((match) => [match[0], match[1], match[2]])).toEqual([
            ["# Heading 1\n", "#", "Heading 1"],
            [" ## Heading 2\n", "##", "Heading 2"], // 行首有空格
            ["### Heading 3", "###", "Heading 3"],
        ])
    })
})

describe("anchorGenerator", () => {
    it("生成正确的锚点", () => {
        expect(anchorGenerator("标题 123")).toEqual("标题-123")
        expect(anchorGenerator("Hello World!")).toEqual("hello-world")
        expect(anchorGenerator("Multiple   Spaces")).toEqual("multiple-spaces")
        expect(anchorGenerator("Special@#&*Characters")).toEqual("special-characters")
        expect(anchorGenerator("中文标题")).toEqual("中文标题")
        expect(anchorGenerator(" 标题行首行尾有空格 ")).toEqual("标题行首行尾有空格")
    })

    it("处理连续的 - 符号", () => {
        expect(anchorGenerator("Hello--World")).toEqual("hello-world")
        expect(anchorGenerator("Multiple---Dashes")).toEqual("multiple-dashes")
    })

    it("去除首尾的 - 符号", () => {
        expect(anchorGenerator("-Hello-World-")).toEqual("hello-world")
        expect(anchorGenerator("--Multiple-Dashes--")).toEqual("multiple-dashes")
    })
})

describe("createRegexCache", () => {
    it("缓存中的正则匹配", () => {
        const regexCache = createRegexCache()

        expect(regexCache.hTagRegex).toEqual(/<h\d.*?>.*?<\/h\d>/g)
        expect(regexCache.hTagLevelRegex).toEqual(/<h(\d).*?>/)
        expect(regexCache.hTagAnchorRegex).toEqual(/id="(.*)"/)
        expect(regexCache.htmlTagRegex).toEqual(/<.*?>/g)
        expect(regexCache.markdownHeadingRegex).toEqual(/^\s{0,3}(#{1,6})\s+(.*)(?:\n+|$)/gm)
    })

    it("匹配 h 标签", () => {
        const { hTagRegex } = createRegexCache()
        const html = "<h1>Title</h1><h2>Subtitle</h2>"
        const matches = html.match(hTagRegex)
        expect(matches).toEqual(["<h1>Title</h1>", "<h2>Subtitle</h2>"])
    })

    it("匹配 h 标签的等级", () => {
        const { hTagLevelRegex } = createRegexCache()
        const hTag = "<h2>Subtitle</h2>"
        const match = hTag.match(hTagLevelRegex)
        expect(match?.[0]).toEqual("<h2>")
        expect(match?.[1]).toEqual("2")
    })

    it("匹配 h 标签的锚点", () => {
        const { hTagAnchorRegex } = createRegexCache()
        const hTag = '<h2 id="subtitle">Subtitle</h2>'
        const match = hTag.match(hTagAnchorRegex)
        expect(match?.[0]).toEqual('id="subtitle"')
        expect(match?.[1]).toEqual("subtitle")
    })

    it("匹配所有 HTML 标签", () => {
        const { htmlTagRegex } = createRegexCache()
        const html = "<div><p>Paragraph</p></div>"
        const matches = html.match(htmlTagRegex)
        expect(matches).toEqual(["<div>", "<p>", "</p>", "</div>"])
    })

    it("匹配 markdown 标题", () => {
        const { markdownHeadingRegex } = createRegexCache()
        const markdown = "# Heading 1\n ## Heading 2\n### Heading 3"
        const matches = [...markdown.matchAll(markdownHeadingRegex)]
        expect(matches.map((match) => [match[0], match[1], match[2]])).toEqual([
            ["# Heading 1\n", "#", "Heading 1"],
            [" ## Heading 2\n", "##", "Heading 2"], // 行首有空格
            ["### Heading 3", "###", "Heading 3"],
        ])
    })
})

describe("anchorGenerator", () => {
    it("生成正确的锚点", () => {
        expect(anchorGenerator("标题 123")).toEqual("标题-123")
        expect(anchorGenerator("Hello World!")).toEqual("hello-world")
        expect(anchorGenerator("Multiple   Spaces")).toEqual("multiple-spaces")
        expect(anchorGenerator("Special@#&*Characters")).toEqual("special-characters")
        expect(anchorGenerator("中文标题")).toEqual("中文标题")
        expect(anchorGenerator(" 标题行首行尾有空格 ")).toEqual("标题行首行尾有空格")
    })

    it("处理连续的 - 符号", () => {
        expect(anchorGenerator("Hello--World")).toEqual("hello-world")
        expect(anchorGenerator("Multiple---Dashes")).toEqual("multiple-dashes")
    })

    it("去除首尾的 - 符号", () => {
        expect(anchorGenerator("-Hello-World-")).toEqual("hello-world")
        expect(anchorGenerator("--Multiple-Dashes--")).toEqual("multiple-dashes")
    })
})

describe("generateAllHeadingAnchorAndHref", () => {
    it("为 html 中的所有 h 标签生成锚点和 href", () => {
        const html = "<h1>Title</h1><h2>Subtitle</h2>"
        const result = generateAllHeadingAnchor(html)
        expect(result).toContain('id="idx0-title"')
        expect(result).toContain('id="idx1-subtitle"')
    })

    it("处理没有 h 标签的 html", () => {
        const html = "<div>No headings here</div>"
        const result = generateAllHeadingAnchor(html)
        expect(result).toEqual(html)
    })

    it("处理包含特殊字符的 h 标签", () => {
        const html = "<h1>Hello@World!</h1>"
        const result = generateAllHeadingAnchor(html)
        expect(result).toContain('id="idx0-hello-world"')
    })
})
