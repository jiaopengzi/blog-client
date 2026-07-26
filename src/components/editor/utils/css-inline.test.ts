/**
 * FilePath    : blog-client\src\components\editor\utils\css-inline.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : CSS 内联样式管线测试 (特异性排序, 260726-02)
 */

import { describe, expect, it } from "vitest"

import { computeSelectorSpecificity, getMatchedCssStyleRules, getMatchedSelectorSpecificity, splitSelectorList } from "./css-inline"
import type { InlineStyleApplyContext } from "../types"

/**
 * @description: 构造样式规则并返回其 CSSStyleRule 对象, 用于模拟 document.styleSheets 中的规则.
 * @param cssText 完整规则文本.
 * @return 解析后的 CSSStyleRule.
 */
function createStyleRule(cssText: string): CSSStyleRule {
    const style = document.createElement("style")
    style.textContent = cssText
    document.head.appendChild(style)
    const rule = style.sheet!.cssRules[0] as CSSStyleRule
    return rule
}

/**
 * @description: 构造空的内联样式应用上下文.
 * @return InlineStyleApplyContext 实例.
 */
function createApplyContext(): InlineStyleApplyContext {
    return {
        matchedRuleCache: new Map(),
        inlineStyleRecordCache: new Map(),
        computedPropertyCache: new Map(),
    }
}

describe("splitSelectorList", () => {
    it("按顶层逗号拆分并忽略括号内逗号", () => {
        expect(splitSelectorList("#preview h1, #preview-copy h1")).toEqual(["#preview h1", "#preview-copy h1"])
        expect(splitSelectorList(":is(a, b) .x, h2")).toEqual([":is(a, b) .x", "h2"])
        expect(splitSelectorList('[data-x="a,b"], h3')).toEqual(['[data-x="a,b"]', "h3"])
    })
})

describe("computeSelectorSpecificity", () => {
    it("id > class > 标签的特异性次序正确", () => {
        const id = computeSelectorSpecificity("#preview h1")
        const cls = computeSelectorSpecificity(".title h1")
        const tag = computeSelectorSpecificity("h1")

        expect(id).toBeGreaterThan(cls)
        expect(cls).toBeGreaterThan(tag)
    })

    it("伪元素按标签级计数, 不误计为伪类", () => {
        // ::before 只应计入 c 层, 不应同时计入 b 层
        expect(computeSelectorSpecificity("h1::before")).toBe(computeSelectorSpecificity("h1 span"))
    })
})

describe("getMatchedSelectorSpecificity", () => {
    it("逗号列表取与元素匹配分支的最高特异性", () => {
        const container = document.createElement("div")
        container.id = "preview-copy"
        const h1 = document.createElement("h1")
        container.appendChild(h1)
        document.body.appendChild(container)

        const listSpecificity = getMatchedSelectorSpecificity(h1, "#preview h1, #preview-copy h1, h1")
        expect(listSpecificity).toBe(computeSelectorSpecificity("#preview-copy h1"))

        document.body.removeChild(container)
    })
})

describe("getMatchedCssStyleRules (260726-02 生产构建规则乱序回归)", () => {
    it("低特异性 reset 排在高特异性规则之后时, 排序结果仍按特异性升序", () => {
        const container = document.createElement("div")
        container.id = "preview-copy"
        const h1 = document.createElement("h1")
        container.appendChild(h1)
        document.body.appendChild(container)

        // 模拟生产构建 chunk 顺序: #preview 规则在前, 全局 reset 在后 (dev 下顺序相反)
        const specificRule = createStyleRule("#preview h1, #preview-copy h1 { margin: 1.5em auto 1em; text-align: center; }")
        const resetRule = createStyleRule("h1, h2, h3 { margin: 0; padding: 0; }")

        const sorted = getMatchedCssStyleRules(h1, [specificRule, resetRule], createApplyContext())

        // reset 必须排在前 (特异性低), #preview-copy h1 排在后 → last-writer-wins 合并后保留 margin auto
        expect(sorted[0]).toBe(resetRule)
        expect(sorted[1]).toBe(specificRule)

        document.body.removeChild(container)
        document.head.querySelectorAll("style").forEach((s) => s.remove())
    })

    it("同特异性规则保持文档顺序 (稳定排序)", () => {
        const container = document.createElement("div")
        container.id = "preview"
        const h2 = document.createElement("h2")
        container.appendChild(h2)
        document.body.appendChild(container)

        const first = createStyleRule("#preview h2 { color: red; }")
        const second = createStyleRule("#preview h2 { color: blue; }")

        const sorted = getMatchedCssStyleRules(h2, [first, second], createApplyContext())

        expect(sorted[0]).toBe(first)
        expect(sorted[1]).toBe(second)

        document.body.removeChild(container)
        document.head.querySelectorAll("style").forEach((s) => s.remove())
    })
})
