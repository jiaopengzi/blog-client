import { describe, expect, it } from "vitest"

import createMarked from "./new-marked"

describe("createMarked 函数", () => {
    it("应返回同一个共享 Marked 实例", () => {
        const markedA = createMarked()
        const markedB = createMarked()

        expect(markedA).toBe(markedB)
    })

    it("应保持 Markdown 解析能力", () => {
        const html = createMarked().parse("# 标题\n\n`code`").toString()

        expect(html).toContain("<h1")
        expect(html).toContain("标题")
        expect(html).toContain("<code>code</code>")
    })
})
