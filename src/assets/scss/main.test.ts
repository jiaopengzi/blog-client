/**
 * FilePath    : blog-client\src\assets\scss\main.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 全局滚动条与原生文本域样式回归测试
 */

import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { pathToFileURL } from "node:url"

import { compileString } from "sass"
import { expect, it, onTestFinished } from "vitest"

// Vitest 默认不处理 CSS, 按 Nuxt 的 Sass 配置编译全局样式.
const require = createRequire(import.meta.url)
const styleUrl = pathToFileURL(require.resolve("./main.scss"))
const mainCss = compileString(
    `@use "./platform/_phone.scss" as phone;
     @use "./platform/_pad.scss" as pad;
     @use "./platform/_pc.scss" as pc;
     @use "./mixin.scss" as *;
     ${readFileSync(styleUrl, "utf8")}`,
    {
        url: styleUrl,
        importers: [{ findFileUrl: (url) => (url === "reset-css" ? pathToFileURL(require.resolve(url)) : null) }],
        silenceDeprecations: ["color-4-api"],
    },
).css

/**
 * 读取样式表中的样式规则, 包括响应式规则中的样式规则.
 * @param rules - 样式表或媒体查询中的 CSS 规则.
 * @returns 样式规则列表.
 */
function getStyleRules(rules: CSSRuleList): CSSStyleRule[] {
    return Array.from(rules).flatMap((rule) => {
        if (rule instanceof CSSMediaRule) {
            return getStyleRules(rule.cssRules)
        }
        return rule instanceof CSSStyleRule ? [rule] : []
    })
}

/**
 * 读取元素使用的滚动条尺寸、圆角和滑块颜色.
 * @param element - 滚动区域.
 * @returns 按属性顺序排列的样式变量值.
 */
function readScrollbarMetrics(element: Element): string[] {
    const computed = getComputedStyle(element)
    return ["y-width", "x-height", "thumb-radius", "track-radius", "thumb-bg"].map((name) =>
        computed.getPropertyValue(`--scrollbar-${name}`).replace(/\s/g, ""),
    )
}

it("全局滚动条规则为原生文本域和 Element Plus 文本域使用同一组样式", () => {
    const fixture = document.createElement("div")
    fixture.innerHTML = `
        <textarea></textarea>
        <div class="el-textarea"><textarea class="el-textarea__inner"></textarea></div>
        <div style="overflow: auto"></div>
        <style></style>
    `
    const style = fixture.querySelector("style")!
    style.textContent = mainCss + "html { --scrollbar-thumb-bg: #909399; }"
    document.body.append(fixture)
    const root = document.documentElement
    const rootClass = root.className
    root.classList.remove("dark")
    root.classList.add("light")
    onTestFinished(() => {
        fixture.remove()
        root.className = rootClass
    })

    const [nativeTextarea, componentTextarea] = fixture.querySelectorAll("textarea")
    const scrollContainer = fixture.querySelector("[style]")!
    const rules = getStyleRules(style.sheet!.cssRules).filter(({ selectorText }) => selectorText.includes("::-webkit-scrollbar"))
    const scrollbarRules = (pseudo: string, element: Element) =>
        rules.filter(({ selectorText }) => {
            // 无元素选择器的伪元素规则等价于对任意元素生效.
            return selectorText.endsWith(pseudo) && element.matches(selectorText.slice(0, -pseudo.length).replace(/(^|\s)$/, "$1*"))
        })

    expect(rules.some(({ selectorText }) => selectorText.includes(".el-textarea__inner"))).toBe(false)
    for (const [pseudo, property, variable] of [
        ["::-webkit-scrollbar", "width", "--scrollbar-y-width"],
        ["::-webkit-scrollbar-thumb", "background-color", "--scrollbar-thumb-bg"],
        ["::-webkit-scrollbar-track", "border-radius", "--scrollbar-track-radius"],
    ]) {
        const sharedRules = scrollbarRules(pseudo, scrollContainer)
        const values = sharedRules.map((rule) => rule.style.getPropertyValue(property))
        expect(values.some((value) => value === `var(${variable})` || value.startsWith(`var(${variable},`)), property).toBe(true)
        expect(scrollbarRules(pseudo, nativeTextarea)).toEqual(sharedRules)
        expect(scrollbarRules(pseudo, componentTextarea)).toEqual(sharedRules)
    }

    const lightMetrics = ["6px", "6px", "10px", "10px", "rgba(0,0,0,0.2)"]
    expect(readScrollbarMetrics(nativeTextarea)).toEqual(lightMetrics)
    expect(readScrollbarMetrics(componentTextarea)).toEqual(lightMetrics)
    const containerMetrics = readScrollbarMetrics(scrollContainer)
    expect(containerMetrics).toEqual(readScrollbarMetrics(root))
    expect(containerMetrics.slice(3)).toEqual(["3px", "#909399"])

    root.classList.replace("light", "dark")
    const darkMetrics = ["6px", "6px", "10px", "10px", "rgba(255,255,255,0.2)"]
    expect(readScrollbarMetrics(nativeTextarea)).toEqual(darkMetrics)
    expect(readScrollbarMetrics(componentTextarea)).toEqual(darkMetrics)
    expect(readScrollbarMetrics(scrollContainer)).toEqual(containerMetrics)
})
