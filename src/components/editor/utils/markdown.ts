/**
 * FilePath    : blog-client\src\components\editor\utils\markdown.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Markdown 渲染与 HTML 处理
 */

import DOMPurify, { type Config } from "dompurify"

import { CustomElementAttributes, Names } from "@/customElements"
import { getActiveImageCaptionFormat } from "@/pkg/marked/extension/renderer"
import createMarked from "@/pkg/marked/new-marked"
import { extractImageUrlsFromHtml } from "@/utils/img"
import { htmlTagReplace } from "@/utils/tagReplace"

import type { Heading } from "../components/toc"
import type { MarkdownHeadingLine, RegexCache } from "../types"

export type MarkdownRenderResult = {
    html: string
    tocHtml: Heading[]
    imgUrls: string[]
}

type QuoteBlockKind = "alert" | "blockquote"

type QuoteBlockInfo = {
    kind: QuoteBlockKind
    shouldMergeWithPreviousAlert: boolean
}

/**
 * @description: 更新属性名数组
 * @param tarAttributeNames 目标元素的属性名数组
 * @param srcAttributeNamesList 源元素的属性名数组列表
 * @return  更新后目标元素的属性名数组
 */
export const updateAttributeNames = (tarAttributeNames: Array<string>, srcAttributeNamesList: Array<Array<string>>) => {
    // /id|class/ DOMPurify 允许的 自定义元素的属性名
    for (let i = 0; i < srcAttributeNamesList.length; i++) {
        const srcAttributeNames = srcAttributeNamesList[i]!
        for (let j = 0; j < srcAttributeNames.length; j++) {
            tarAttributeNames.push(srcAttributeNames[j]!) // 添加属性名
        }
    }

    return tarAttributeNames
}

/**
 * @description: 根据当前自定义元素枚举构建允许的标签名正则.
 * @return 自定义元素标签名正则.
 */
export const getCustomElementHeadingTagNameRegex = (): RegExp => {
    const tagNames = Object.values(Names)
    if (tagNames.length === 0) return /^$/
    return new RegExp(`^(${tagNames.join("|")})$`)
}

/**
 * @description: 根据当前自定义元素属性列表构建允许的属性名正则.
 * @return 自定义元素属性名正则.
 */
export const getCustomElementHeadingAttributeNameRegex = (): RegExp => {
    const attributeNames: string[] = []

    updateAttributeNames(attributeNames, [CustomElementAttributes])

    return new RegExp(`${attributeNames.join("|")}`)
}

/**
 * @description: 使用闭包创建正则表达式缓存
 * @return {Object} 正则表达式缓存
 */
export const createRegexCache = (): RegexCache => {
    const h1TagRegex = /<h1.*?>.*?<\/h1>/ // 匹配 h1 标签 注意需要 g 全局匹配
    const hTagRegex = /<h\d.*?>.*?<\/h\d>/g // 匹配 h 标签 注意需要 g 全局匹配
    const hTagStartRegex = /<h(\d)/ // 匹配 h 标签的开始
    const hTagLevelRegex = /<h(\d).*?>/ // 匹配 h 标签的等级
    const hTagAnchorRegex = /id="(.*)"/ // 匹配 h 标签的锚点
    const htmlTagRegex = /<.*?>/g // 匹配所有 HTML 标签
    const markdownHeadingRegex = /^\s{0,3}(#{1,6})\s+(.*)(?:\n+|$)/gm // 匹配 markdown 标题
    const nonAlphaNumericRegex = /[^a-zA-Z0-9\u4e00-\u9fa5]/g // 匹配非中文、字母、数字的字符
    const multipleDashRegex = /-{2,}/g // 匹配多个连续的 -
    const leadingTrailingDashRegex = /^-|-$/g // 匹配首尾的 -

    const utf8BomRegex = /^\uFEFF/ // 匹配 utf-8 bom 头
    const windowsNewLineRegex = /\r\n/g // 匹配 windows 换行符

    // <button type="button" class="copy-button"> CSS</button>
    // 匹配所有 class 中有 copy-button 的按钮元素, gi 表示全局匹配且不区分大小写
    const copyButtonRegex = /<button[^>]*\bcopy-button\b[^>]*>.*?<\/button>/gi

    // 匹配 details 标签
    const detailsTagRegex = /<details[\s\S]*?<\/details>/gi
    // 需要去掉 details 标签
    const detailsTagToRemoveRegex = /<\/?details[^>]*>/g
    // 匹配 HTML 命名实体（如 &lt; &gt; &amp; &quot; &apos; 等）
    const htmlNamedEntityRegex = /&(?:amp|lt|gt|quot|apos|#39|#x27|#x2F);/g
    // 匹配 HTML 十进制数字实体（如 &#39; &#160; 等）
    const htmlDecimalEntityRegex = /&#(\d+);/g
    // 匹配 HTML 十六进制数字实体（如 &#x27; &#x2F; 等）
    const htmlHexEntityRegex = /&#x([\da-fA-F]+);/g
    return {
        h1TagRegex,
        hTagRegex,
        hTagStartRegex,
        hTagLevelRegex,
        hTagAnchorRegex,
        htmlTagRegex,
        markdownHeadingRegex,
        nonAlphaNumericRegex,
        multipleDashRegex,
        leadingTrailingDashRegex,
        customElementHeadingTagNameRegex: getCustomElementHeadingTagNameRegex(),
        customElementHeadingAttributeNameRegex: getCustomElementHeadingAttributeNameRegex(),
        utf8BomRegex,
        windowsNewLineRegex,
        copyButtonRegex,
        detailsTagRegex,
        detailsTagToRemoveRegex,
        htmlNamedEntityRegex,
        htmlDecimalEntityRegex,
        htmlHexEntityRegex,
    }
}

// 正则表达式缓存
export const regexCache = createRegexCache()

export const MARKDOWN_RENDER_CACHE_LIMIT = 20
export const markdownRenderCache = new Map<string, MarkdownRenderResult>()
export const markdownSanitizeConfig: Config = {
    CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: (tagName) => !!tagName.match(regexCache.customElementHeadingTagNameRegex),
        attributeNameCheck: (attr) => !!attr.match(regexCache.customElementHeadingAttributeNameRegex),
        allowCustomizedBuiltInElements: true,
    },
}

/**
 * getCachedValue 从 LRU Map 中读取缓存, 并刷新当前项的最近使用顺序.
 * @param cache 缓存 Map.
 * @param key 缓存 key.
 * @returns 命中的缓存值, 未命中时返回 undefined.
 */
export function getCachedValue<T>(cache: Map<string, T>, key: string): T | undefined {
    const cachedValue = cache.get(key)
    if (cachedValue === undefined) {
        return undefined
    }

    cache.delete(key)
    cache.set(key, cachedValue)
    return cachedValue
}

/**
 * setCachedValue 将结果写入 LRU Map, 并按上限回收最旧缓存.
 * @param cache 缓存 Map.
 * @param key 缓存 key.
 * @param value 缓存值.
 * @param limit 缓存上限.
 */
export function setCachedValue<T>(cache: Map<string, T>, key: string, value: T, limit: number): void {
    if (cache.has(key)) {
        cache.delete(key)
    }

    cache.set(key, value)

    while (cache.size > limit) {
        const oldestKey = cache.keys().next().value
        if (!oldestKey) {
            break
        }
        cache.delete(oldestKey)
    }
}

/**
 * cloneMarkdownRenderResult 克隆缓存中的 Markdown 渲染结果, 避免外部修改缓存对象.
 * @param result 原始渲染结果.
 * @returns 克隆后的渲染结果.
 */
export function cloneMarkdownRenderResult(result: MarkdownRenderResult): MarkdownRenderResult {
    return {
        html: result.html,
        tocHtml: result.tocHtml.map((heading) => ({ ...heading })),
        imgUrls: [...result.imgUrls],
    }
}

/**
 * getMarkdownRenderVariantKey 获取当前 Markdown 渲染环境的变体键。
 * 当前用于区分会影响最终 HTML 输出的图注格式, 避免不同模式错误复用同一份缓存。
 * @returns 当前渲染环境对应的变体键。
 */
export function getMarkdownRenderVariantKey(): string {
    return `image-caption:${getActiveImageCaptionFormat()}`
}

/**
 * getMarkdownRenderCacheKey 为 Markdown 渲染结果生成缓存 key.
 * @param markdownSrc Markdown 原文.
 * @param isRemoveFirstH1 是否移除首个 H1.
 * @returns 当前输入对应的缓存 key.
 */
export function getMarkdownRenderCacheKey(markdownSrc: string, isRemoveFirstH1: boolean): string {
    return `${Number(isRemoveFirstH1)}:${getMarkdownRenderVariantKey()}:${markdownSrc}`
}

/**
 * @description: 标题锚点生成器
 * @return {String} 生成的锚点
 */
export const anchorGenerator = (text: string | undefined): string => {
    if (!text) return ""
    const { nonAlphaNumericRegex, multipleDashRegex, leadingTrailingDashRegex } = createRegexCache()
    return text
        .replace(nonAlphaNumericRegex, "-") // 替换非中文、字母、数字的字符
        .replace(multipleDashRegex, "-") // 替换多个连续的 -
        .replace(leadingTrailingDashRegex, "") // 去除首尾的 -
        .toLowerCase() // 转为小写
}

/**
 * @description: 标题锚点生成器包含索引
 * @param text 标题内容
 * @param index 索引
 * @return {String} 生成的锚点
 */
export const anchorGeneratorWithIndex = (text: string | undefined, index: number | undefined): string => {
    if (!text || index === void 0) return ""
    // 为了不然锚点中出现数字开头的情况, 将索引index简写为 idx
    return `idx${index.toString()}-${anchorGenerator(text)}`
}

/**
 * @description: 从 markdown 字符串中获取所有标题行号
 * @param markdownStr 源字符串
 * @return       标题,行号数组
 */
export function getMarkdownHeadingLines(markdownStr: string): MarkdownHeadingLine[] {
    const { markdownHeadingRegex } = regexCache
    const lines = markdownStr.split("\n")
    const targetLines: MarkdownHeadingLine[] = []
    let headingIndex = 0 // 标题索引

    for (let i = 0; i < lines.length; i++) {
        const matchArray = lines[i]!.match(markdownHeadingRegex)

        if (matchArray) {
            targetLines.push({
                index: headingIndex++,
                markdownHeading: lines[i]!,
                markdownLineNumber: i + 1,
            })
        }
    }

    return targetLines
}

/**
 * getFirstLevelOneMarkdownHeadingText 提取 Markdown 中首个一级标题文本.
 * @param markdownStr Markdown 原文.
 * @returns 首个一级标题文本, 未命中时返回空字符串.
 */
export function getFirstLevelOneMarkdownHeadingText(markdownStr: string): string {
    const { markdownHeadingRegex } = regexCache
    const matches = markdownStr.matchAll(markdownHeadingRegex)

    for (const match of matches) {
        const headingLevelToken = match[1]
        const headingText = match[2]?.trim() ?? ""

        if (headingLevelToken === "#" && headingText) {
            return headingText
        }
    }

    return ""
}

/**
 * getSafeHeadingCurrentIndex 将当前目录高亮索引收敛到合法范围.
 * @param currentIndex 当前高亮索引.
 * @param headingsLength 当前目录长度.
 * @returns 合法索引, 无目录时返回 -1.
 */
export function getSafeHeadingCurrentIndex(currentIndex: number, headingsLength: number): number {
    if (headingsLength <= 0) {
        return -1
    }

    if (currentIndex < 0) {
        return 0
    }

    if (currentIndex >= headingsLength) {
        return headingsLength - 1
    }

    return currentIndex
}

/**
 * @description: 为 html 中的所有 h 标签生成锚点
 * @param html
 * @return {String} 生成锚点和 href 的后 html 字符串
 */
export function generateAllHeadingAnchor(html: string): string {
    const { hTagRegex, hTagStartRegex, htmlTagRegex, hTagAnchorRegex } = regexCache
    let headingIndex = 0 // 标题索引

    // 使用 replace 的回调函数处理每个匹配的标题
    return html.replace(hTagRegex, (match) => {
        // 判断是否已经有锚点, 如果已经有锚点, 则不进行处理
        const existingAnchor = match.match(hTagAnchorRegex)
        if (existingAnchor) {
            return match
        }

        const text = match.replace(htmlTagRegex, "") // h 标签的文本
        const anchor = anchorGeneratorWithIndex(text, headingIndex++) // h 标签的锚点,标题+索引
        const anchorAndHref = `id="${anchor}"` // 锚点

        // 向 h 标签中添加锚点
        // $1 是正则表达式替换中的占位符, 用于插入第一个捕获组的内容。
        // 在当前的代码中, 它的作用是将正则表达式中捕获的 h 标签的数字(如 1, 2, 3) 动态插入到替换结果中。
        return match.replace(hTagStartRegex, `<h$1 ${anchorAndHref}`)
    })
}

// HTML 命名实体映射表(模块级缓存，避免每次调用时重复创建)
export const HTML_ENTITY_MAP: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'",
    "&#x2F;": "/",
    "&apos;": "'",
}
/**
 * @description : 解码 HTML 实体字符（如 &lt; &gt; &amp; &quot; &#39; 及数字实体）
 * @param str                  : 包含 HTML 实体的字符串
 * @param htmlNamedEntityRegex : 匹配 HTML 命名实体的正则表达式（来自 regexCache，避免重复创建）
 * @param htmlDecimalEntityRegex : 匹配 HTML 十进制数字实体的正则表达式（来自 regexCache，避免重复创建）
 * @param htmlHexEntityRegex   : 匹配 HTML 十六进制数字实体的正则表达式（来自 regexCache，避免重复创建）
 * @return                     : 解码后的字符串
 */
export function decodeHtmlEntities(str: string, htmlNamedEntityRegex: RegExp, htmlDecimalEntityRegex: RegExp, htmlHexEntityRegex: RegExp): string {
    return str
        .replace(htmlNamedEntityRegex, (entity) => HTML_ENTITY_MAP[entity] ?? entity)
        .replace(htmlDecimalEntityRegex, (_, dec) => String.fromCharCode(Number(dec)))
        .replace(htmlHexEntityRegex, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

/**
 * @description : 通过正则表达式匹配 html 中所有的 h 标签 并转换为 HeadingType 数组
 * @param html  : html 字符串
 * @return      : 匹配到的 h 标签数组
 */
export function matchAllHeadingToList(html: string): Heading[] {
    const { hTagRegex, hTagLevelRegex, hTagAnchorRegex, htmlTagRegex, htmlNamedEntityRegex, htmlDecimalEntityRegex, htmlHexEntityRegex } = regexCache
    const matches = html.match(hTagRegex) || [] // 匹配到的 h 标签数组
    const headingList: Heading[] = [] // h 标签数组
    let headingIndex = 0 // 标题索引

    matches.forEach((item) => {
        // 遍历匹配到的 h 标签数组
        const level = Number(item.match(hTagLevelRegex)?.[1]) || 1 // h 标签的等级
        const text = decodeHtmlEntities(item.replace(htmlTagRegex, ""), htmlNamedEntityRegex, htmlDecimalEntityRegex, htmlHexEntityRegex) // h 标签的文本（解码 HTML 实体）
        const anchor = item.match(hTagAnchorRegex)?.[1] || "" // h 标签的锚点
        headingList.push({
            index: headingIndex++,
            level,
            text,
            anchor,
        })
    })

    return headingList
}

/**
 * @description: 通过 markdown 字符串生成 html 字符串
 * @param markdownSrc markdown 字符串
 * @param isRemoveFirstH1 是否移除第一个 H1 标签
 * @return {String} html 字符串
 */
export function markdownToHtml(markdownSrc: string, isRemoveFirstH1: boolean): string {
    return renderMarkdownDocument(markdownSrc, isRemoveFirstH1).html
}

/**
 * renderMarkdownDocument 将 Markdown 一次性转换为预览所需的完整渲染产物, 并在相同输入下复用缓存.
 * @param markdownSrc Markdown 字符串.
 * @param isRemoveFirstH1 是否移除第一个 H1 标签.
 * @returns 包含 html, tocHtml 和 imgUrls 的渲染结果.
 */
export function renderMarkdownDocument(markdownSrc: string, isRemoveFirstH1: boolean): MarkdownRenderResult {
    const cacheKey = getMarkdownRenderCacheKey(markdownSrc, isRemoveFirstH1)
    const cachedResult = getCachedValue(markdownRenderCache, cacheKey)

    if (cachedResult) {
        return cloneMarkdownRenderResult(cachedResult)
    }

    const markdownParse = createMarked().parse(markdownSrc).toString()
    const normalizedHtml = htmlHandleUtf8BOM(markdownParse)
    let purifiedHtml = DOMPurify.sanitize(normalizedHtml, markdownSanitizeConfig) as string

    if (isRemoveFirstH1) {
        purifiedHtml = htmlRemoveFirstH1(purifiedHtml)
    }

    const html = generateAllHeadingAnchor(mergeAlertContinuationBlockquotes(purifiedHtml, markdownSrc))
    const result: MarkdownRenderResult = {
        html,
        tocHtml: matchAllHeadingToList(html),
        imgUrls: extractImageUrlsFromHtml(html),
    }

    setCachedValue(markdownRenderCache, cacheKey, result, MARKDOWN_RENDER_CACHE_LIMIT)
    return cloneMarkdownRenderResult(result)
}

/**
 * @description: 从 Markdown 原文中提取顶层引用块顺序, 并标记哪些普通引用块可并入前一个 alert.
 * 只有当前一个顶层块是 alert, 且两个引用块之间的空白行少于 2 行时, 才视为同一提示块续写.
 * @param markdownSrc Markdown 原文.
 * @return 顶层引用块信息列表.
 */
export function collectQuoteBlockInfos(markdownSrc: string): QuoteBlockInfo[] {
    const lines = markdownSrc.split("\n")
    const quoteBlocks: QuoteBlockInfo[] = []
    const quoteLineRegex = /^\s{0,3}>/
    let blankLineCount = 0
    let previousTopLevelBlockKind: QuoteBlockKind | "other" | null = null
    let lineIndex = 0

    while (lineIndex < lines.length) {
        const line = lines[lineIndex] ?? ""

        if (line.trim() === "") {
            blankLineCount += 1
            lineIndex += 1
            continue
        }

        if (quoteLineRegex.test(line)) {
            const quoteLines: string[] = []

            while (lineIndex < lines.length) {
                const currentLine = lines[lineIndex] ?? ""
                if (!quoteLineRegex.test(currentLine)) {
                    break
                }

                quoteLines.push(currentLine)
                lineIndex += 1
            }

            const firstQuoteContentLine =
                quoteLines.map((quoteLine) => quoteLine.replace(/^\s{0,3}>\s?/, "").trim()).find((quoteLine) => quoteLine.length > 0) ?? ""
            const kind: QuoteBlockKind = /^\[![^\]]+\]/.test(firstQuoteContentLine) ? "alert" : "blockquote"

            quoteBlocks.push({
                kind,
                shouldMergeWithPreviousAlert: previousTopLevelBlockKind === "alert" && kind === "blockquote" && blankLineCount < 2,
            })

            previousTopLevelBlockKind = kind
            blankLineCount = 0
            continue
        }

        previousTopLevelBlockKind = "other"
        blankLineCount = 0
        lineIndex += 1
    }

    return quoteBlocks
}

/**
 * @description: 判断普通 blockquote 是否可视为前一个 alert 的续写块.
 * 仅合并由段落或列表组成的顶层 blockquote, 避免误吞真正独立的引用内容.
 * @param alertElement 前一个提示块元素.
 * @param blockquoteElement 当前普通引用块元素.
 * @return 若应并入前一个提示块则返回 true.
 */
export function isAlertContinuationBlockquote(alertElement: Element | null, blockquoteElement: Element | null): boolean {
    if (!alertElement || !blockquoteElement) {
        return false
    }

    if (!alertElement.classList.contains("markdown-alert") || blockquoteElement.tagName !== "BLOCKQUOTE") {
        return false
    }

    const childElements = Array.from(blockquoteElement.children)
    if (childElements.length === 0) {
        return false
    }

    const allowedTags = new Set(["P", "UL", "OL"])
    return childElements.every((childElement) => allowedTags.has(childElement.tagName))
}

/**
 * @description: 合并 alert 后紧跟的普通 blockquote 续块, 使其继续保留在同一个提示容器中.
 * 某些 Markdown 写法会把后续 `>` 列表拆成新的 blockquote, 这里在最终 HTML 层最小化修正结构.
 * @param htmlSrc 原始 HTML 字符串.
 * @return 合并续块后的 HTML 字符串.
 */
export function mergeAlertContinuationBlockquotes(htmlSrc: string, markdownSrc: string): string {
    if (!htmlSrc.includes("markdown-alert") || !htmlSrc.includes("<blockquote")) {
        return htmlSrc
    }

    const quoteBlockInfos = collectQuoteBlockInfos(markdownSrc)
    if (quoteBlockInfos.length === 0) {
        return htmlSrc
    }

    const template = document.createElement("template")
    template.innerHTML = htmlSrc

    let currentElement = template.content.firstElementChild
    let quoteBlockIndex = 0

    while (currentElement) {
        const nextElement = currentElement.nextElementSibling
        const currentQuoteBlockInfo = currentElement.matches(".markdown-alert, blockquote") ? quoteBlockInfos[quoteBlockIndex] : null
        const nextQuoteBlockInfo = nextElement?.matches(".markdown-alert, blockquote") ? quoteBlockInfos[quoteBlockIndex + 1] : null

        if (nextElement && nextQuoteBlockInfo?.shouldMergeWithPreviousAlert && isAlertContinuationBlockquote(currentElement, nextElement)) {
            let nextChildNode = nextElement.firstChild

            while (nextChildNode) {
                currentElement.append(nextChildNode)
                nextChildNode = nextElement.firstChild
            }
            nextElement.remove()
            quoteBlockIndex += 1
            continue
        }

        if (currentQuoteBlockInfo) {
            quoteBlockIndex += 1
        }

        currentElement = nextElement
    }

    return template.innerHTML
}

/**
 * @description:  处理 utf-8 编码问题
 * @param htmlSrc html 源码
 * @return 替换后的 html 源码
 */
export function htmlHandleUtf8BOM(htmlSrc: string) {
    // 处理 utf-8 编码问题
    return htmlSrc.replace(regexCache.utf8BomRegex, "").replace(regexCache.windowsNewLineRegex, "\n") // 去除 BOM 头 和 windows 换行符
}

/**
 * @description: 匹配所有 class 中有 copy-button 的按钮元素 替换掉
 * @param htmlSrc html 源码
 * @return  替换后的 html 源码
 */
export function htmlHandleCopyBtns(htmlSrc: string) {
    // 匹配所有 class 中有 copy-button 的按钮元素 替换为空
    return htmlSrc.replace(regexCache.copyButtonRegex, "")
}

/**
 * @description: 将 details 标签去掉直接内容保留
 * @param htmlSrc html 源码
 * @return 替换后的 html 源码
 */
export function htmlHandleDetailsTag(htmlSrc: string) {
    return htmlSrc.replace(regexCache.detailsTagRegex, (match) => {
        // 去掉 details 标签
        return match.replace(regexCache.detailsTagToRemoveRegex, "")
    })
}

/**
 * @description: html 处理微信预览
 * @param htmlSrc html 源码
 * @return  替换后的 html 源码
 */
export function htmlHandleWeChat(htmlSrc: string) {
    // 去除 copy 按钮
    htmlSrc = htmlHandleCopyBtns(htmlSrc)

    // 将 div 替换为 section
    htmlSrc = htmlTagReplace(htmlSrc, "div", "section")

    // 处理 details 标签
    htmlSrc = htmlHandleDetailsTag(htmlSrc)

    return htmlSrc
}

/**
 * @description: html 移除第一个 h1 标签
 * @param htmlSrc html 源码
 * @return  移除后的 html 源码
 */
export function htmlRemoveFirstH1(htmlSrc: string) {
    // 移除第一个 h1 标签
    const h1Match = htmlSrc.match(regexCache.h1TagRegex)
    if (h1Match) {
        const h1Tag = h1Match[0] // 获取第一个 h1 标签
        htmlSrc = htmlSrc.replace(h1Tag, "") // 移除第一个 h1 标签
    }
    return htmlSrc
}
