/*
 * FilePath    : blog-client-nuxt\src\utils\markdownRenderer.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Markdown 同构渲染管线(阶段 4 重写, 双端同一实现)
 */

/*
 * 补充说明:
 * 服务端 SSR 与客户端 hydration 共用本管线: marked 解析 → isomorphic-dompurify
 * sanitize(白名单沿用 markdownSanitizeConfig) → node-html-parser DOM 处理
 * (alert 续块合并 / 标题锚点 / 去首 H1), 无浏览器 DOM 依赖.
 */

import DOMPurify from "isomorphic-dompurify"
import { parse } from "node-html-parser"
import type { HTMLElement as ParsedHTMLElement, Node as ParsedNode } from "node-html-parser"

import { CustomElementAttributes, Names } from "@/customElements/constants"
import createMarked from "@/pkg/marked/new-marked"
import { extractImageUrlsFromHtml } from "@/utils/img"
import { applyLocalImageRefs } from "@/utils/mdLocalImage"

import type { Heading } from "@/components/editor/components/toc"
import type { RegexCache } from "@/components/editor/types"

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

const updateAttributeNames = (tarAttributeNames: Array<string>, srcAttributeNamesList: Array<Array<string>>) => {
    for (let i = 0; i < srcAttributeNamesList.length; i++) {
        const srcAttributeNames = srcAttributeNamesList[i]!
        for (let j = 0; j < srcAttributeNames.length; j++) {
            tarAttributeNames.push(srcAttributeNames[j]!)
        }
    }
    return tarAttributeNames
}

const getCustomElementHeadingTagNameRegex = (): RegExp => {
    const tagNames = Object.values(Names)
    if (tagNames.length === 0) return /^$/
    return new RegExp("^(" + tagNames.join("|") + ")$")
}

const getCustomElementHeadingAttributeNameRegex = (): RegExp => {
    const attributeNames: string[] = []
    updateAttributeNames(attributeNames, [CustomElementAttributes])
    return new RegExp(attributeNames.join("|"))
}

const createRegexCache = (): RegexCache => {
    const h1TagRegex = /<h1.*?>.*?<\/h1>/
    const hTagRegex = /<h\d.*?>.*?<\/h\d>/g
    const hTagStartRegex = /<h(\d)/
    const hTagLevelRegex = /<h(\d).*?>/
    const hTagAnchorRegex = /id="(.*)"/
    const htmlTagRegex = /<.*?>/g
    const markdownHeadingRegex = /^\s{0,3}(#{1,6})\s+(.*)(?:\n+|$)/gm
    const nonAlphaNumericRegex = /[^a-zA-Z0-9\u4e00-\u9fa5]/g
    const multipleDashRegex = /-{2,}/g
    const leadingTrailingDashRegex = /^-|-$/g
    const utf8BomRegex = /^\uFEFF/
    const windowsNewLineRegex = /\r\n/g
    const htmlNamedEntityRegex = /&(?:amp|lt|gt|quot|apos|#39|#x27|#x2F);/g
    const htmlDecimalEntityRegex = /&#(\d+);/g
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
        copyButtonRegex: /<button[^>]*\bcopy-button\b[^>]*>.*?<\/button>/gi,
        detailsTagRegex: /<details[\s\S]*?<\/details>/gi,
        detailsTagToRemoveRegex: /<\/?details[^>]*>/g,
        htmlNamedEntityRegex,
        htmlDecimalEntityRegex,
        htmlHexEntityRegex,
    }
}

const regexCache = createRegexCache()

export const markdownSanitizeConfig = {
    // 与 dompurify 3.4.13 默认 IS_ALLOWED_URI 保持一致, 仅追加 md-img: (/md 页本地图片引用协议,
    // 详见 utils/mdLocalImage.ts); 该协议不可导航无 XSS 面, 未注册的引用渲染为透明占位.
    // 升级 dompurify 时需同步比对默认正则有无变化
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|md-img):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: (tagName: string) => !!tagName.match(regexCache.customElementHeadingTagNameRegex),
        attributeNameCheck: (attr: string) => !!attr.match(regexCache.customElementHeadingAttributeNameRegex),
        allowCustomizedBuiltInElements: true,
    },
}

export const anchorGenerator = (text: string | undefined): string => {
    if (!text) return ""
    const { nonAlphaNumericRegex, multipleDashRegex, leadingTrailingDashRegex } = createRegexCache()
    return text.replace(nonAlphaNumericRegex, "-").replace(multipleDashRegex, "-").replace(leadingTrailingDashRegex, "").toLowerCase()
}

export const anchorGeneratorWithIndex = (text: string | undefined, index: number | undefined): string => {
    if (!text || index === void 0) return ""
    return "idx" + index.toString() + "-" + anchorGenerator(text)
}

export function generateAllHeadingAnchor(html: string): string {
    const { hTagRegex, hTagStartRegex, htmlTagRegex, hTagAnchorRegex } = regexCache
    let headingIndex = 0
    return html.replace(hTagRegex, (match) => {
        const existingAnchor = match.match(hTagAnchorRegex)
        if (existingAnchor) {
            return match
        }
        const text = match.replace(htmlTagRegex, "")
        const anchor = anchorGeneratorWithIndex(text, headingIndex++)
        const anchorAndHref = 'id="' + anchor + '"'
        return match.replace(hTagStartRegex, "<h$1 " + anchorAndHref)
    })
}

const HTML_ENTITY_MAP: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "\u0027",
    "&#x27;": "\u0027",
    "&#x2F;": "/",
    "&apos;": "\u0027",
}

function decodeHtmlEntities(str: string, htmlNamedEntityRegex: RegExp, htmlDecimalEntityRegex: RegExp, htmlHexEntityRegex: RegExp): string {
    return str
        .replace(htmlNamedEntityRegex, (entity) => HTML_ENTITY_MAP[entity] ?? entity)
        .replace(htmlDecimalEntityRegex, (_, dec) => String.fromCharCode(Number(dec)))
        .replace(htmlHexEntityRegex, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

export function matchAllHeadingToList(html: string): Heading[] {
    const { hTagRegex, hTagLevelRegex, hTagAnchorRegex, htmlTagRegex, htmlNamedEntityRegex, htmlDecimalEntityRegex, htmlHexEntityRegex } = regexCache
    const matches = html.match(hTagRegex) || []
    const headingList: Heading[] = []
    let headingIndex = 0
    matches.forEach((item) => {
        const level = Number(item.match(hTagLevelRegex)?.[1]) || 1
        const text = decodeHtmlEntities(item.replace(htmlTagRegex, ""), htmlNamedEntityRegex, htmlDecimalEntityRegex, htmlHexEntityRegex)
        const anchor = item.match(hTagAnchorRegex)?.[1] || ""
        headingList.push({ index: headingIndex++, level, text, anchor })
    })
    return headingList
}

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

function isElementNode(node: ParsedNode): node is ParsedHTMLElement {
    return node.nodeType === 1
}

function isAlertOrBlockquote(element: ParsedHTMLElement): boolean {
    const tag = element.tagName
    return tag === "BLOCKQUOTE" || (element.classList !== undefined && (element.classList as unknown as Set<string>).has("markdown-alert"))
}

function isAlertContinuationBlockquote(alertElement: ParsedHTMLElement | null, blockquoteElement: ParsedHTMLElement | null): boolean {
    if (!alertElement || !blockquoteElement) {
        return false
    }
    const classList = alertElement.classList as unknown as Set<string> | undefined
    if (!classList || !classList.has("markdown-alert") || blockquoteElement.tagName !== "BLOCKQUOTE") {
        return false
    }
    const childElements = blockquoteElement.childNodes.filter(isElementNode)
    if (childElements.length === 0) {
        return false
    }
    const allowedTags = new Set(["P", "UL", "OL"])
    return childElements.every((childElement) => allowedTags.has(childElement.tagName))
}

function mergeAlertContinuationBlockquotes(htmlSrc: string, markdownSrc: string): string {
    if (!htmlSrc.includes("markdown-alert") || !htmlSrc.includes("<blockquote")) {
        return htmlSrc
    }
    const quoteBlockInfos = collectQuoteBlockInfos(markdownSrc)
    if (quoteBlockInfos.length === 0) {
        return htmlSrc
    }
    const root = parse(htmlSrc)
    const elements = root.childNodes.filter(isElementNode)
    let quoteBlockIndex = 0
    let i = 0
    while (i < elements.length) {
        const currentElement = elements[i]!
        const nextElement = elements[i + 1]
        const currentQuoteBlockInfo = isAlertOrBlockquote(currentElement) ? quoteBlockInfos[quoteBlockIndex] : null
        const nextQuoteBlockInfo = nextElement && isAlertOrBlockquote(nextElement) ? quoteBlockInfos[quoteBlockIndex + 1] : null
        if (nextElement && nextQuoteBlockInfo?.shouldMergeWithPreviousAlert && isAlertContinuationBlockquote(currentElement, nextElement)) {
            const children = nextElement.childNodes.slice()
            for (const child of children) {
                currentElement.appendChild(child)
            }
            nextElement.remove()
            elements.splice(i + 1, 1)
            quoteBlockIndex += 1
            continue
        }
        if (currentQuoteBlockInfo) {
            quoteBlockIndex += 1
        }
        i += 1
    }
    return root.toString()
}

function htmlHandleUtf8BOM(htmlSrc: string): string {
    return htmlSrc.replace(regexCache.utf8BomRegex, "").replace(regexCache.windowsNewLineRegex, "\n")
}

function htmlRemoveFirstH1(htmlSrc: string): string {
    const h1Match = htmlSrc.match(regexCache.h1TagRegex)
    if (h1Match) {
        htmlSrc = htmlSrc.replace(h1Match[0], "")
    }
    return htmlSrc
}

export function renderMarkdownDocument(markdownSrc: string, isRemoveFirstH1: boolean): MarkdownRenderResult {
    const markdownParse = createMarked().parse(markdownSrc).toString()
    const normalizedHtml = htmlHandleUtf8BOM(markdownParse)
    let purifiedHtml = DOMPurify.sanitize(normalizedHtml, markdownSanitizeConfig) as string
    // 本地图片引用 (md-img:<uuid>) 借道白名单通过 sanitize, 此处替换为注册表中的 blob URL;
    // 非本地引用场景此调用为无匹配的字符串 includes 检查, 零成本
    purifiedHtml = applyLocalImageRefs(purifiedHtml)
    if (isRemoveFirstH1) {
        purifiedHtml = htmlRemoveFirstH1(purifiedHtml)
    }
    const html = generateAllHeadingAnchor(mergeAlertContinuationBlockquotes(purifiedHtml, markdownSrc))
    return {
        html,
        tocHtml: matchAllHeadingToList(html),
        imgUrls: extractImageUrlsFromHtml(html),
    }
}

export function markdownToHtml(markdownSrc: string, isRemoveFirstH1: boolean): string {
    return renderMarkdownDocument(markdownSrc, isRemoveFirstH1).html
}
