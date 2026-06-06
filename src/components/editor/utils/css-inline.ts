/**
 * FilePath    : blog-client\src\components\editor\utils\css-inline.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : CSS 内联样式应用流水线
 */

import { BORDER_SIDE_SHORTHAND, getLonghands, isShorthand, normalizeValue } from "./css-shorthand"
import { hasClassName, isHeadingElement } from "./dom"
import type { FilteredStyles, InlineStyleApplyContext } from "../types"

/**
 * @description: 获取所有外部样式表并按照它们在 document.styleSheets 中的位置进行排序
 * @return 已排序的外部样式表列表和索引
 */
export function getSortedStyleSheets(): [CSSStyleSheet, number][] {
    return Array.from(document.styleSheets)
        .map((sheet, index) => [sheet, index] as [CSSStyleSheet, number])
        .filter(([sheet]) => {
            try {
                return !!sheet.cssRules
            } catch {
                // 跨域或 CSP 阻止访问
                console.warn("无法访问样式表规则, 可能是跨域或 CSP 阻止访问:", sheet)
                return false
            }
        })
}

/**
 * @description: 获取 CSSStyleRule 列表
 * @param cssStyleSheets 外部样式表列表和索引
 * @return CSSStyleRule 列表
 */
export function getCssStyleRules(cssStyleSheets: [CSSStyleSheet, number][]): CSSStyleRule[] {
    const cssStyleRules: CSSStyleRule[] = []

    cssStyleSheets.forEach(([styleSheet]) => {
        try {
            Array.from(styleSheet.cssRules).forEach((rule: CSSRule) => {
                if (rule instanceof CSSStyleRule) {
                    cssStyleRules.push(rule)
                }
            })
        } catch (error) {
            console.warn("Error accessing rules in stylesheet:", styleSheet, error)
        }
    })

    return cssStyleRules
}

/**
 * 微信公众平台编辑器明确不支持或会被过滤的 CSS 属性黑名单
 * 这些属性在内联样式中会被移除或忽略, 即使写在 style 里也无效
 */
export const WechatCssBlackList: readonly string[] = [
    // "position",
    "border-image",
    // "font-family",
    // "font-style",
    // "font-variant",
    // "font-kerning",
    // "font-stretch",
    // "font-language-override",
    // "font-language-override",
    // "font-size-adjust",
    // "font-optical-sizing",
]

// 全局白名单(暂时为空)
export const WechatCssAllWhiteList: readonly string[] = []

// 代码块容器白名单
export const WechatCssPreCodeWhiteList: readonly string[] = ["font-family", "font-size", "line-height", "color", "background-color", "padding", "margin"]

/**
 * @description: 检查 CSS 属性和值在是否在微信公众平台编辑器中的黑名单中
 * @param property CSS属性名
 * @param value CSS属性值
 * @returns 若属性在黑名单中则返回 true, 否则 false
 */
export function isWechatCssBlackListProperty(property: string, value: string): boolean {
    if (!property || !value) {
        return true
    }

    // 检查属性是否在黑名单中
    if (WechatCssBlackList.length > 0) {
        for (let i = 0; i < WechatCssBlackList.length; i++) {
            // 属性名开头匹配黑名单
            if (property.startsWith(WechatCssBlackList[i]!)) {
                return true
            }
        }
    }

    return false
}

// 需要过滤的预设样式值
export const WideKeywords: ReadonlySet<string> = new Set(["initial", "inherit", "revert", "revert-layer", "unset"])

/**
 * @description: 过滤计算样式中非用户定义的样式
 * @param el 元素
 * @return 过滤后的样式对象
 */
export function filterInvalidComputedStyles(el: HTMLElement | SVGElement, properties?: string[]): FilteredStyles {
    const computedStyle = getComputedStyle(el)

    const filteredStyles: FilteredStyles = {}
    const targetProperties = properties && properties.length > 0 ? properties : Array.from(computedStyle)

    for (let i = 0; i < targetProperties.length; i++) {
        const property = targetProperties[i]
        if (!property) continue
        const value = computedStyle.getPropertyValue(property)

        // 过滤掉非用户定义的样式值
        if (!WideKeywords.has(value.toLowerCase())) {
            filteredStyles[property] = value
        }
    }

    return filteredStyles
}

/**
 * applyBorderLonghandsFromComputedStyle 从 computedStyle 中提取可见的 border 长写值写入克隆节点。
 * 仅处理 inlineStyleRecord 中存在 border 简写属性的对应边, 避免无边框元素写入多余的 0px none。
 * 调用 normalizeValue 消除浏览器缩放产生的分数像素。
 * @param clonedEl 克隆的目标节点, 用于写入内联样式。
 * @param inlineStyleRecord 匹配 CSS 规则的属性字典, 用于检测存在哪些 border 简写。
 * @param computedStyle 原始节点的计算样式, 作为长写值的唯一数据源。
 */
export function applyBorderLonghandsFromComputedStyle(
    clonedEl: HTMLElement | SVGElement,
    inlineStyleRecord: Record<string, string>,
    computedStyle: FilteredStyles,
): void {
    const sides = new Set<"top" | "right" | "bottom" | "left">()
    const borderSideLonghandRegex = /^border-(top|right|bottom|left)-(width|style|color)$/

    for (const property of Object.keys(inlineStyleRecord)) {
        if (property === "border") {
            sides.add("top").add("right").add("bottom").add("left")
        } else if (BORDER_SIDE_SHORTHAND[property]) {
            sides.add(BORDER_SIDE_SHORTHAND[property])
        } else {
            const match = property.match(borderSideLonghandRegex)
            if (match && match[1]) {
                sides.add(match[1] as "top" | "right" | "bottom" | "left")
            }
        }
    }

    for (const side of sides) {
        const sideWidthProperty = `border-${side}-width`
        const sideStyleProperty = `border-${side}-style`
        const sideColorProperty = `border-${side}-color`
        const sideShorthandProperty = `border-${side}`
        let width = computedStyle[sideWidthProperty] ?? ""
        let style = computedStyle[sideStyleProperty] ?? ""
        let color = computedStyle[sideColorProperty] ?? ""

        const shorthandValue = inlineStyleRecord[sideShorthandProperty] || inlineStyleRecord.border
        if (shorthandValue) {
            const parser = document.createElement("div")
            parser.style.setProperty(sideShorthandProperty, shorthandValue)

            width = parser.style.getPropertyValue(sideWidthProperty) || width
            style = parser.style.getPropertyValue(sideStyleProperty) || style
            color = parser.style.getPropertyValue(sideColorProperty) || color
        }

        const normalizedWidth = normalizeValue(sideWidthProperty, width)
        const widthNum = parseFloat(normalizedWidth)
        if (!normalizedWidth || !Number.isFinite(widthNum) || widthNum <= 0) continue
        if (!style || style === "none" || style === "hidden") continue

        clonedEl.style.setProperty(sideWidthProperty, normalizedWidth)
        clonedEl.style.setProperty(sideStyleProperty, style)
        if (color) {
            clonedEl.style.setProperty(sideColorProperty, color)
        }
    }
}

/**
 * applyInlineStylesToElement 将原始元素的计算样式应用为克隆元素的内联样式(两阶段)。
 * Phase 1: 写入非简写属性, 跳过 isShorthand 中的简写及 heading 的 border longhand,
 *   避免 reset 与特定规则之间的迭代顺序导致级联覆盖错误。
 * Phase 2: 由 applyBorderLonghandsFromComputedStyle 以 computedStyle 为数据源统一下发 border 长写值。
 *   对 heading 额外强制展开 border, 解决 var() 导致 CSSOM 简写为空的问题。
 * @param originalEl 原始元素(用于读取 computedStyle 和判断 heading)。
 * @param clonedEl 克隆元素(用于写入 inline style)。
 * @param matchedRules 克隆元素匹配到的 CSS 规则列表。
 * @param computedStyle 过滤后的计算样式对象。
 * @param applyContext 内联样式应用过程中的缓存上下文。
 */
export function applyInlineStylesToElement(
    originalEl: HTMLElement | SVGElement,
    clonedEl: HTMLElement | SVGElement,
    matchedRules: CSSStyleRule[],
    computedStyle: FilteredStyles,
    applyContext: InlineStyleApplyContext,
) {
    if (!computedStyle || Object.keys(computedStyle).length === 0) return

    const isKatex = hasClassName(originalEl, "katex")
    if (isKatex) return

    const isPreCode = hasClassName(originalEl, "pre-code-container")
    const isHeading = isHeadingElement(originalEl)

    const inlineStyleRecord = getInlineStyleRecord(clonedEl, matchedRules, isPreCode, applyContext)
    const hasBorderSideDefinition = Object.keys(inlineStyleRecord).some((property) => {
        if (property === "border" || BORDER_SIDE_SHORTHAND[property]) {
            return true
        }

        return /^border-(top|right|bottom|left)-(width|style|color)$/.test(property)
    })

    Object.keys(inlineStyleRecord).forEach((property) => {
        const cssStyleValue = inlineStyleRecord[property]

        if (isShorthand(property)) {
            return
        }

        if (hasBorderSideDefinition && /^border-(width|style|color)$/.test(property)) {
            return
        }

        if (isHeading && property.startsWith("border-")) {
            return
        }

        if (/^border-(top|right|bottom|left)-width$/.test(property)) {
            clonedEl.style.setProperty(property, cssStyleValue)
            return
        }

        const computedStyleValue = computedStyle[property]

        if (!cssStyleValue || !computedStyleValue) return

        const notUseComputedStyleValues = ["auto", "100%", "100vw", "100vh", "normal", "none"]

        if (cssStyleValue !== computedStyleValue && !notUseComputedStyleValues.includes(cssStyleValue)) {
            clonedEl.style.setProperty(property, computedStyleValue)
        } else {
            clonedEl.style.setProperty(property, cssStyleValue)
        }
    })

    applyBorderLonghandsFromComputedStyle(clonedEl, inlineStyleRecord, computedStyle)

    if (isHeading) {
        applyBorderLonghandsFromComputedStyle(clonedEl, { border: "" }, computedStyle)
    }

    if (WechatCssAllWhiteList.length > 0) {
        WechatCssAllWhiteList.forEach((property) => {
            const cssStyleValue = computedStyle[property]
            if (cssStyleValue) {
                clonedEl.style.setProperty(property, cssStyleValue)
            }
        })
    }
}

/**
 * @description: 获取节点签名对应的内联样式字典, 命中缓存时避免重复展开样式规则.
 * @param element 当前克隆节点.
 * @param matchedRules 已匹配到的样式规则列表.
 * @param isPreCode 是否为代码块容器.
 * @param applyContext 内联样式应用过程中的缓存上下文.
 * @return 内联样式属性字典.
 */
export function getInlineStyleRecord(
    element: HTMLElement | SVGElement,
    matchedRules: CSSStyleRule[],
    isPreCode: boolean,
    applyContext: InlineStyleApplyContext,
): Record<string, string> {
    // 同类节点会重复命中相同样式签名, 这里缓存展开后的属性字典, 降低批量复制时的规则遍历成本.
    const cacheKey = `${getInlineStyleRuleCacheKey(element)}::${isPreCode ? "pre" : "default"}`
    const cachedRecord = applyContext.inlineStyleRecordCache.get(cacheKey)
    if (cachedRecord) {
        return cachedRecord
    }

    const inlineStyleRecord: Record<string, string> = {}

    matchedRules.forEach((rule) => {
        try {
            for (let i = 0; i < rule.style.length; i++) {
                const property = rule.style[i]

                if (!property) continue

                const cssStyleValue = rule.style.getPropertyValue(property)

                // 含 var() 的简写属性(如 border-bottom: 2px solid var(--xxx))在 CSSOM 中 getPropertyValue 返回空,
                // 但仍需保留其键名, 以便 applyBorderLonghandsFromComputedStyle 从 computedStyle 展开长写值。
                if (!cssStyleValue) {
                    if (isShorthand(property)) {
                        inlineStyleRecord[property] = ""
                    }
                    continue
                }

                if (isWechatCssBlackListProperty(property, cssStyleValue)) {
                    continue
                }

                if (isPreCode && WechatCssPreCodeWhiteList.length > 0 && !WechatCssPreCodeWhiteList.includes(property)) {
                    continue
                }

                inlineStyleRecord[property] = cssStyleValue
            }
        } catch (error) {
            console.warn("Error matching style rule:", rule.selectorText, error)
        }
    })

    applyContext.inlineStyleRecordCache.set(cacheKey, inlineStyleRecord)
    return inlineStyleRecord
}

/**
 * @description: 获取当前节点匹配到的样式规则, 并按节点签名缓存结果.
 * @param element 当前节点.
 * @param cssStyleRules 可用的样式规则列表.
 * @param applyContext 内联样式应用过程中的缓存上下文.
 * @return 当前节点命中的样式规则数组.
 */
export function getMatchedCssStyleRules(
    element: HTMLElement | SVGElement,
    cssStyleRules: CSSStyleRule[],
    applyContext: InlineStyleApplyContext,
): CSSStyleRule[] {
    const cacheKey = getInlineStyleRuleCacheKey(element)
    const cachedRules = applyContext.matchedRuleCache.get(cacheKey)
    if (cachedRules) {
        return cachedRules
    }

    const matchedRules = cssStyleRules.filter((rule) => {
        try {
            return element.matches(rule.selectorText)
        } catch (error) {
            console.warn("Error matching style rule:", rule.selectorText, error)
            return false
        }
    })

    applyContext.matchedRuleCache.set(cacheKey, matchedRules)
    return matchedRules
}

/**
 * @description: 收集当前节点真正需要读取的计算样式属性, 避免全量遍历 computedStyle.
 * @param element 当前节点.
 * @param matchedRules 当前节点命中的样式规则.
 * @param applyContext 内联样式应用过程中的缓存上下文.
 * @return 需要读取的属性名列表.
 */
export function getRelevantComputedStyleProperties(
    element: HTMLElement | SVGElement,
    matchedRules: CSSStyleRule[],
    applyContext: InlineStyleApplyContext,
): string[] {
    const cacheKey = getInlineStyleRuleCacheKey(element)
    const cachedProperties = applyContext.computedPropertyCache.get(cacheKey)
    if (cachedProperties) {
        return cachedProperties
    }

    const propertySet = new Set<string>()

    matchedRules.forEach((rule) => {
        for (let i = 0; i < rule.style.length; i++) {
            const property = rule.style[i]
            if (!property) {
                continue
            }

            propertySet.add(property)

            // 将简写属性展开为对应长写, 确保 filterInvalidComputedStyles 通过 getComputedStyle 读到长写值。
            const longhands = getLonghands(property)
            if (longhands.length > 0) {
                longhands.forEach((longhand) => propertySet.add(longhand))
            }
        }
    })

    WechatCssAllWhiteList.forEach((property) => {
        propertySet.add(property)
    })

    if (hasClassName(element, "pre-code-container")) {
        WechatCssPreCodeWhiteList.forEach((property) => {
            propertySet.add(property)
        })
    }

    const relevantProperties = Array.from(propertySet)
    applyContext.computedPropertyCache.set(cacheKey, relevantProperties)
    return relevantProperties
}

/**
 * @description: 为节点生成样式缓存签名, 用于复用规则匹配和属性展开结果.
 * @param element 当前节点.
 * @return 节点签名字符串.
 */
export function getInlineStyleRuleCacheKey(element: HTMLElement | SVGElement): string {
    // 复制链路里的缓存以标签名、id 和稳定排序后的 class 组合作为签名, 兼顾命中率与实现复杂度.
    // oxlint-disable-next-line unicorn/no-array-sort
    const classNames = "classList" in element && element.classList instanceof DOMTokenList ? Array.from(element.classList).sort().join(".") : ""
    const tagName = "tagName" in element ? element.tagName.toLowerCase() : ""
    const id = "id" in element ? element.id : ""

    return `${tagName}#${id}.${classNames}`
}

/**
 * @description: 分批处理待复制节点队列, 在批次间让出一帧以减轻长任务阻塞.
 * @param queue 待处理的原始节点与克隆节点配对队列.
 * @param cssStyleRules 已展开的样式规则列表.
 * @param applyContext 内联样式应用过程中的缓存上下文.
 * @return void.
 */
export async function processInlineStyleQueue(
    queue: Array<{ originalEl: HTMLElement | SVGElement; clonedEl: HTMLElement | SVGElement }>,
    cssStyleRules: CSSStyleRule[],
    applyContext: InlineStyleApplyContext,
    waitForNextRenderFrame: () => Promise<void>,
): Promise<void> {
    let processedCount = 0

    while (queue.length > 0 && processedCount < 20) {
        const currentPair = queue.shift()
        if (!currentPair) {
            continue
        }

        const { originalEl, clonedEl } = currentPair

        // 在原始节点上做 CSS 选择器匹配, 而非克隆节点。
        // 克隆节点在离屏容器中丢失了 #preview 等祖先上下文, 导致后代选择器(如 #preview h1)匹配失败。
        const matchedRules = getMatchedCssStyleRules(originalEl, cssStyleRules, applyContext)
        const relevantProperties = getRelevantComputedStyleProperties(originalEl, matchedRules, applyContext)
        const computedStyle = filterInvalidComputedStyles(originalEl, relevantProperties)

        if (!computedStyle || Object.keys(computedStyle).length === 0 || hasClassName(originalEl, "katex")) {
            continue
        }

        applyInlineStylesToElement(originalEl, clonedEl, matchedRules, computedStyle, applyContext)

        const originalChildren = Array.from(originalEl.children)
        const clonedChildren = Array.from(clonedEl.children)

        if (originalChildren.length !== clonedChildren.length) {
            console.warn("Original and cloned element child count mismatch", originalEl, clonedEl)
            continue
        }

        for (let i = 0; i < originalChildren.length; i++) {
            const origChild = originalChildren[i]
            const cloneChild = clonedChildren[i]

            if (
                (origChild instanceof HTMLElement || origChild instanceof SVGElement) &&
                (cloneChild instanceof HTMLElement || cloneChild instanceof SVGElement)
            ) {
                queue.push({ originalEl: origChild, clonedEl: cloneChild })
            }
        }

        processedCount += 1
    }

    if (queue.length === 0) {
        return
    }

    await waitForNextRenderFrame()
    await processInlineStyleQueue(queue, cssStyleRules, applyContext, waitForNextRenderFrame)
}

/**
 * @description: 对整棵克隆树分批应用内联样式, 保留复制链路所需的缓存复用能力.
 * @param originalRoot 原始预览根节点.
 * @param clonedRoot 克隆后的预览根节点.
 * @param cssStyleRules 已展开的样式规则列表.
 * @return void.
 */
export async function applyInlineStylesInBatches(
    originalRoot: HTMLElement | SVGElement,
    clonedRoot: HTMLElement | SVGElement,
    cssStyleRules: CSSStyleRule[],
    waitForNextRenderFrame: () => Promise<void>,
): Promise<void> {
    const queue: Array<{ originalEl: HTMLElement | SVGElement; clonedEl: HTMLElement | SVGElement }> = [{ originalEl: originalRoot, clonedEl: clonedRoot }]
    const applyContext: InlineStyleApplyContext = {
        matchedRuleCache: new Map<string, CSSStyleRule[]>(),
        computedPropertyCache: new Map<string, string[]>(),
        inlineStyleRecordCache: new Map<string, Record<string, string>>(),
    }

    // 分批处理并在批次间让出一帧, 避免大文档复制时长时间阻塞主线程.
    await processInlineStyleQueue(queue, cssStyleRules, applyContext, waitForNextRenderFrame)
}
