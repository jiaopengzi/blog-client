import { describe, expect, it } from "vitest"

import { getFirstLevelOneMarkdownHeadingText, getSafeHeadingCurrentIndex } from "./utils"

describe("getFirstLevelOneMarkdownHeadingText", () => {
    it("提取首个一级标题作为页面标题", () => {
        const markdown = ["## 二级标题", "", "# 页面主标题", "", "# 第二个一级标题"].join("\n")

        expect(getFirstLevelOneMarkdownHeadingText(markdown)).toBe("页面主标题")
    })

    it("没有一级标题时返回空字符串", () => {
        const markdown = ["## 二级标题", "### 三级标题"].join("\n")

        expect(getFirstLevelOneMarkdownHeadingText(markdown)).toBe("")
    })
})

describe("getSafeHeadingCurrentIndex", () => {
    it("目录为空时返回 -1", () => {
        expect(getSafeHeadingCurrentIndex(0, 0)).toBe(-1)
    })

    it("目录缩短后将旧索引收敛到最后一项", () => {
        expect(getSafeHeadingCurrentIndex(4, 2)).toBe(1)
    })

    it("负索引在有目录时回退到第一项", () => {
        expect(getSafeHeadingCurrentIndex(-1, 3)).toBe(0)
    })
})
