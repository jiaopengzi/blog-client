import { describe, expect, it } from "vitest"

import { cssExample } from "./cssExample"

describe("cssExample", () => {
    it("默认使用主站预览根选择器", () => {
        const result = cssExample()

        expect(result).toContain("#preview {")
        expect(result).toContain("#preview h1 {")
    })

    it("支持传入局部预览根选择器", () => {
        const result = cssExample(".md-page-preview")

        expect(result).toContain(".md-page-preview {")
        expect(result).toContain(".md-page-preview h1 {")
        expect(result).not.toContain("#preview h1 {")
    })
})
