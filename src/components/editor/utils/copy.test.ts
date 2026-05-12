/**
 * FilePath    : blog-client\src\components\editor\utils\copy.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 复制管线与 KaTeX 模块测试
 */

import { describe, expect, it } from "vitest"

import { scaleDisplayKatexByFontSize } from "./copy"

describe("scaleDisplayKatexByFontSize", () => {
    it("在容器宽度不足时缩放行间公式", () => {
        const container = document.createElement("div")
        const wrapper = document.createElement("div")
        const displayElement = document.createElement("div")
        const formulaElement = document.createElement("span")

        displayElement.className = "katex-display"
        formulaElement.className = "katex"

        displayElement.appendChild(formulaElement)
        wrapper.appendChild(displayElement)
        container.appendChild(wrapper)

        Object.defineProperty(wrapper, "clientWidth", {
            configurable: true,
            value: 200,
        })
        Object.defineProperty(formulaElement, "offsetWidth", {
            configurable: true,
            value: 400,
        })

        scaleDisplayKatexByFontSize(container)

        expect(formulaElement.style.fontSize).toBe("50%")
    })

    it("在容器宽度充足时清除旧的缩放样式", () => {
        const container = document.createElement("div")
        const wrapper = document.createElement("div")
        const displayElement = document.createElement("div")
        const formulaElement = document.createElement("span")

        displayElement.className = "katex-display"
        formulaElement.className = "katex"
        formulaElement.style.fontSize = "50%"

        displayElement.appendChild(formulaElement)
        wrapper.appendChild(displayElement)
        container.appendChild(wrapper)

        Object.defineProperty(wrapper, "clientWidth", {
            configurable: true,
            value: 400,
        })
        Object.defineProperty(formulaElement, "offsetWidth", {
            configurable: true,
            value: 200,
        })

        scaleDisplayKatexByFontSize(container)

        expect(formulaElement.style.fontSize).toBe("")
    })
})
