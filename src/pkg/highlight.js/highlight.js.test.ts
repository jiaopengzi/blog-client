import { describe, expect, it } from "vitest"

import createHighlighter from "./highlight.js"

describe("createHighlighter 函数", () => {
    it("应返回同一个共享高亮实例", () => {
        const highlighterA = createHighlighter()
        const highlighterB = createHighlighter()

        expect(highlighterA).toBe(highlighterB)
    })

    it("应注册项目依赖的扩展语言", () => {
        const highlighter = createHighlighter()

        expect(highlighter.getLanguage("dax")).toBeTruthy()
        expect(highlighter.getLanguage("m")).toBeTruthy()
        expect(highlighter.getLanguage("pq")).toBeTruthy()
    })
})
