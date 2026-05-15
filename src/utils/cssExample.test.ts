/**
 * FilePath    : blog-client\src\utils\cssExample.test.ts
 * Author      : GitHub Copilot
 * Description : 自定义样式 CSS 示例测试
 */

import { describe, expect, it } from "vitest"

import { cssExample } from "./cssExample"

describe("cssExample", () => {
    it("应包含与预览列表一致的变量化列表样式", () => {
        const css = cssExample()

        expect(css).toContain("--preview-paragraph-indent: 2em;")
        expect(css).toContain("font-family: var(--preview-font-family-title);")
        expect(css).toContain("--preview-list-text-offset: 1.28em;")
        expect(css).toContain("counter-reset: preview-ordered-list;")
        expect(css).toContain("padding-left: var(--preview-list-indent-step);")
        expect(css).toContain("#preview ol li > p,")
        expect(css).toContain("#preview .task-list-item .task-list-icon {")
        expect(css).not.toContain("list-style: decimal;")
        expect(css).not.toContain("margin-left: -1.5em;")
    })

    it("应支持替换自定义预览根选择器", () => {
        const css = cssExample(".md-page-preview")

        expect(css).toContain(".md-page-preview {")
        expect(css).not.toContain("#preview {")
    })
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
