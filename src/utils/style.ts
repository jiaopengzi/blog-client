/**
 * @FilePath     : \blog-client\src\utils\style.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 样式工具类
 */

import { type ImgFit } from "@/components/common"

import { findFirstOutsideString, findMatchingBlockEnd, removeCommentsSafe } from "./cssValidator"

const defaultLightThemeSelector = 'html[data-theme="light"]'
const defaultDarkThemeSelector = 'html[data-theme="dark"]'
const mdPreviewScopeSelectorAlias = ".md-page-preview"
const mdPreviewScopeSelectorVariants = ["#preview.md-page-preview", '#preview-copy.md-page-preview[data-preview="wechat"]']

/**
 * @description: 设置主题
 * @param theme  主题名称
 */
export function setTheme(theme: string) {
    const root = document.documentElement
    root.setAttribute("data-theme", theme)
}

/**
 * @description:   获取元素的样式值
 * @param element  目标元素
 * @param property 样式属性
 * @return         样式值
 */
export function getComputedStyleValue(element: HTMLElement, property: string): number {
    return parseFloat(getComputedStyle(element).getPropertyValue(property))
}

/**
 * @description: 设置css变量
 * @param element 目标元素
 * @param variableName 变量名称
 * @param value 变量值
 */
export function setCSSVariable(element: HTMLElement, variableName: string, value: string): void {
    element.style.setProperty(variableName, value)
}

/**
 * @description: 获取css变量值
 * @param element 目标元素
 * @param variableName 变量名称
 * @return 变量值
 */
export function getCSSVariableValue(element: HTMLElement, variableName: string): string {
    return getComputedStyle(element).getPropertyValue(variableName)
}

/**
 * @description: 图片样式
 * @param width 宽度 默认50px
 * @param height 高度 默认50px
 * @param imgFit 图片填充方式 默认cover
 * @return    图片样式
 */
export function imgStyle(width: number | undefined, height: number | undefined, imgFit: ImgFit | undefined): Record<string, string> {
    return {
        width: width ? `${width}px` : "50px", // 宽度
        height: height ? `${height}px` : "50px", // 高度
        "object-fit": imgFit ? imgFit : "cover", // 图片填充方式
    }
}

/**
 * @description: 图标样式
 * @param fontSize 字体大小 默认40px
 * @return 图标样式
 */
export function iconStyle(fontSize: number | undefined): Record<string, string> {
    return {
        "font-size": fontSize ? `${fontSize}px` : "40px", // 字体大小
    }
}

/**
 * @description: 按选择器列表拆分文本, 忽略字符串, 括号和属性选择器内部的逗号.
 * @param selectorText 选择器文本.
 * @return 拆分后的选择器数组.
 */
function splitSelectorList(selectorText: string): string[] {
    const selectors: string[] = []
    let current = ""
    let roundDepth = 0
    let squareDepth = 0
    let inString: '"' | "'" | null = null
    let escapeNext = false

    for (const char of selectorText) {
        if (escapeNext) {
            current += char
            escapeNext = false
            continue
        }

        if (char === "\\") {
            current += char
            escapeNext = true
            continue
        }

        if (char === '"' || char === "'") {
            if (inString === null) {
                inString = char
            } else if (inString === char) {
                inString = null
            }

            current += char
            continue
        }

        if (inString) {
            current += char
            continue
        }

        if (char === "(") {
            roundDepth++
            current += char
            continue
        }

        if (char === ")") {
            roundDepth = Math.max(0, roundDepth - 1)
            current += char
            continue
        }

        if (char === "[") {
            squareDepth++
            current += char
            continue
        }

        if (char === "]") {
            squareDepth = Math.max(0, squareDepth - 1)
            current += char
            continue
        }

        if (char === "," && roundDepth === 0 && squareDepth === 0) {
            if (current.trim()) {
                selectors.push(current.trim())
            }
            current = ""
            continue
        }

        current += char
    }

    if (current.trim()) {
        selectors.push(current.trim())
    }

    return selectors
}

/**
 * @description: 将默认主题根选择器改写为仅命中默认 light 和 dark 预设.
 * @param selector 单个选择器文本.
 * @return 改写后的选择器数组.
 */
function rewriteDefaultThemeRootSelector(selector: string): string[] {
    const trimmedSelector = selector.trim()

    if (trimmedSelector === "html" || trimmedSelector === ":root") {
        return [defaultLightThemeSelector, defaultDarkThemeSelector]
    }

    if (trimmedSelector === "html.light") {
        return [defaultLightThemeSelector]
    }

    if (trimmedSelector === "html.dark") {
        return [defaultDarkThemeSelector]
    }

    return [trimmedSelector]
}

/**
 * @description: 改写单段规则头部中的主题根选择器, 保留原有缩进与尾部空白.
 * @param preludeSegment 规则头部文本.
 * @return 改写后的规则头部文本.
 */
function rewriteThemePreludeSegment(preludeSegment: string): string {
    const trimmedPrelude = preludeSegment.trim()

    if (!trimmedPrelude || trimmedPrelude.startsWith("@")) {
        return preludeSegment
    }

    const leadingWhitespaceLength = preludeSegment.length - preludeSegment.trimStart().length
    const trailingWhitespaceLength = preludeSegment.length - preludeSegment.trimEnd().length
    const leadingWhitespace = preludeSegment.slice(0, leadingWhitespaceLength)
    const trailingWhitespace = trailingWhitespaceLength > 0 ? preludeSegment.slice(preludeSegment.length - trailingWhitespaceLength) : ""
    const rewrittenSelectors = splitSelectorList(trimmedPrelude)
        .flatMap((selector) => rewriteDefaultThemeRootSelector(selector))
        .join(", ")

    return `${leadingWhitespace}${rewrittenSelectors}${trailingWhitespace}`
}

/**
 * @description: 解析作用域根选择器的真实变体列表.
 * /md 页面会把 .md-page-preview 展开为 web 和 wechat 两个局部根节点, 以便在不污染主站的前提下提升优先级.
 * @param scopeSelector 传入的逻辑作用域选择器.
 * @return 可实际写入 CSS 的作用域选择器列表.
 */
function resolveScopeSelectorVariants(scopeSelector: string): string[] {
    if (scopeSelector === mdPreviewScopeSelectorAlias) {
        return mdPreviewScopeSelectorVariants
    }

    return [scopeSelector]
}

/**
 * @description: 判断当前选择器是否已经包含最终作用域根, 避免重复展开.
 * @param selector 单个选择器文本.
 * @param scopeSelector 逻辑作用域选择器.
 * @return 是否已包含最终作用域根.
 */
function hasResolvedScopeSelector(selector: string, scopeSelector: string): boolean {
    return resolveScopeSelectorVariants(scopeSelector).some((variant) => selector.includes(variant))
}

/**
 * @description: 将逻辑作用域选择器替换为真实作用域根列表.
 * @param selector 单个选择器文本.
 * @param scopeSelector 逻辑作用域选择器.
 * @return 展开后的选择器数组.
 */
function expandScopeSelectorAlias(selector: string, scopeSelector: string): string[] {
    const scopeSelectorVariants = resolveScopeSelectorVariants(scopeSelector)

    if (!selector.includes(scopeSelector) || scopeSelectorVariants.length === 1) {
        return [selector]
    }

    return scopeSelectorVariants.map((variant) => selector.replaceAll(scopeSelector, variant))
}

/**
 * @description: 将单个选择器限制到指定作用域, 并兼容 #preview, html, body, :root 等根选择器.
 * @param selector 单个选择器文本.
 * @param scopeSelector 作用域根选择器.
 * @return 限定后的单个选择器文本数组.
 */
function scopeSingleSelector(selector: string, scopeSelector: string): string[] {
    const trimmedSelector = selector.trim()
    const scopeSelectorVariants = resolveScopeSelectorVariants(scopeSelector)

    if (!trimmedSelector) {
        return []
    }

    if (hasResolvedScopeSelector(trimmedSelector, scopeSelector)) {
        return [trimmedSelector]
    }

    const previewRootPattern = /(#preview-copy|#preview)\b/g
    if (previewRootPattern.test(trimmedSelector)) {
        return expandScopeSelectorAlias(trimmedSelector.replace(previewRootPattern, scopeSelector), scopeSelector)
    }

    if (trimmedSelector.includes(scopeSelector)) {
        return expandScopeSelectorAlias(trimmedSelector, scopeSelector)
    }

    if (trimmedSelector === ":root") {
        return scopeSelectorVariants
    }

    if (trimmedSelector.startsWith(":root")) {
        return scopeSelectorVariants.map((variant) => trimmedSelector.replace(/^:root\b/, variant))
    }

    if (/^html\b/.test(trimmedSelector) || /^body\b/.test(trimmedSelector)) {
        return scopeSelectorVariants.map((variant) => `${trimmedSelector} ${variant}`)
    }

    return scopeSelectorVariants.map((variant) => `${variant} ${trimmedSelector}`)
}

/**
 * @description: 为规则头部追加作用域根选择器, 保留原有缩进与尾部空白.
 * @param preludeSegment 规则头部文本.
 * @param scopeSelector 作用域根选择器.
 * @return 增加作用域后的规则头部文本.
 */
function scopePreludeSegment(preludeSegment: string, scopeSelector: string): string {
    const trimmedPrelude = preludeSegment.trim()

    if (!trimmedPrelude || trimmedPrelude.startsWith("@")) {
        return preludeSegment
    }

    const leadingWhitespaceLength = preludeSegment.length - preludeSegment.trimStart().length
    const trailingWhitespaceLength = preludeSegment.length - preludeSegment.trimEnd().length
    const leadingWhitespace = preludeSegment.slice(0, leadingWhitespaceLength)
    const trailingWhitespace = trailingWhitespaceLength > 0 ? preludeSegment.slice(preludeSegment.length - trailingWhitespaceLength) : ""
    const scopedSelectors = splitSelectorList(trimmedPrelude)
        .flatMap((selector) => scopeSingleSelector(selector, scopeSelector))
        .join(", ")

    return `${leadingWhitespace}${scopedSelectors}${trailingWhitespace}`
}

/**
 * @description: 将管理员自定义主题中的默认根选择器限制为 light 和 dark 默认预设.
 * @param cssContent 自定义 CSS 文本.
 * @return 改写后的 CSS 文本.
 */
export function scopeCustomThemeCss(cssContent: string): string {
    let result = ""
    let cursor = 0

    while (cursor < cssContent.length) {
        const nextBlockStartOffset = findFirstOutsideString(cssContent.slice(cursor), "{")
        if (nextBlockStartOffset === -1) {
            result += cssContent.slice(cursor)
            break
        }

        const blockStart = cursor + nextBlockStartOffset
        const blockEnd = findMatchingBlockEnd(cssContent, blockStart + 1)
        if (blockEnd === -1) {
            return cssContent
        }

        const preludeSegment = cssContent.slice(cursor, blockStart)
        const blockContent = cssContent.slice(blockStart + 1, blockEnd)
        result += `${rewriteThemePreludeSegment(preludeSegment)}{${scopeCustomThemeCss(blockContent)}}`

        cursor = blockEnd + 1
    }

    return result
}

/**
 * @description: 将普通 CSS 规则递归限制到指定作用域, 并保留 @media, @supports 等 at-rule 结构.
 * @param cssContent 原始 CSS 文本.
 * @param scopeSelector 作用域根选择器.
 * @return 限定作用域后的 CSS 文本.
 */
export function scopeCssToSelector(cssContent: string, scopeSelector: string): string {
    let result = ""
    let cursor = 0

    while (cursor < cssContent.length) {
        const nextBlockStartOffset = findFirstOutsideString(cssContent.slice(cursor), "{")
        if (nextBlockStartOffset === -1) {
            result += cssContent.slice(cursor)
            break
        }

        const blockStart = cursor + nextBlockStartOffset
        const blockEnd = findMatchingBlockEnd(cssContent, blockStart + 1)
        if (blockEnd === -1) {
            return cssContent
        }

        const preludeSegment = cssContent.slice(cursor, blockStart)
        const trimmedPrelude = preludeSegment.trim()
        const blockContent = cssContent.slice(blockStart + 1, blockEnd)

        if (/^@(-[a-z]+-)?keyframes\b/i.test(trimmedPrelude) || /^@font-face\b/i.test(trimmedPrelude)) {
            result += `${preludeSegment}{${blockContent}}`
            cursor = blockEnd + 1
            continue
        }

        if (trimmedPrelude.startsWith("@")) {
            result += `${preludeSegment}{${scopeCssToSelector(blockContent, scopeSelector)}}`
            cursor = blockEnd + 1
            continue
        }

        result += `${scopePreludeSegment(preludeSegment, scopeSelector)}{${scopeCssToSelector(blockContent, scopeSelector)}}`
        cursor = blockEnd + 1
    }

    return result
}

/**
 * @description: 设置自定义样式
 * @param cssId 样式ID
 * @param cssContent 样式内容
 */
export const setCustomStyle = (cssId: string, cssContent: string) => {
    // 移除旧的自定义样式
    const oldStyle = document.getElementById(cssId)
    if (oldStyle) {
        oldStyle.remove()
    }

    // 移除注释并修剪空白
    cssContent = scopeCustomThemeCss(removeCommentsSafe(cssContent)).trim()

    // 如果为空则不添加
    if (!cssContent) return

    // 添加新的自定义样式
    const style = document.createElement("style")
    style.id = cssId
    style.textContent = cssContent
    document.head.appendChild(style)
}
