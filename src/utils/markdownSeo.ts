/**
 * FilePath    : blog-client\src\utils\markdownSeo.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : markdownSeo 相关工具函数
 */

import createMarked from "@/pkg/marked/new-marked"

interface MarkdownToken {
    type: string
    raw?: string
    text?: string
    tokens?: MarkdownToken[]
    items?: MarkdownToken[]
    header?: MarkdownToken[]
    rows?: MarkdownToken[][]
}

const skippedHtmlSelectors = ["pre", "code", "script", "style", "template", "noscript", "button", "svg", ".pre-code-container", ".copy-button"]
const htmlBlockSelectors = [
    "address",
    "article",
    "aside",
    "blockquote",
    "details",
    "div",
    "dl",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "li",
    "main",
    "nav",
    "ol",
    "p",
    "section",
    "summary",
    "table",
    "td",
    "th",
    "tr",
    "ul",
]

/**
 * extractSeoDescriptionFromMarkdown 从 Markdown 源文本中提取适合 SEO 描述的纯文本.
 * @param markdown Markdown 原文.
 * @param maxLength 允许提取的最大字符数, 按 code point 计算.
 * @returns 已过滤代码块并规范化空白的 SEO 描述.
 */
export function extractSeoDescriptionFromMarkdown(markdown: string, maxLength: number): string {
    if (!markdown || maxLength <= 0) {
        return ""
    }

    const tokens = createMarked().lexer(markdown) as MarkdownToken[]
    const text = normalizeSeoText(collectBlockSegments(tokens).join("\n"))
    return truncateTextByCodePoint(text, maxLength)
}

/**
 * collectBlockSegments 遍历 Markdown block token, 汇总可进入 SEO 描述的文本片段.
 * @param tokens Markdown block token 列表.
 * @returns 按 block 维度拆分的文本片段数组.
 */
function collectBlockSegments(tokens: MarkdownToken[]): string[] {
    const segments: string[] = []

    for (const token of tokens) {
        switch (token.type) {
            case "space":
            case "hr":
            case "def":
            case "code":
                break
            case "list": {
                for (const item of token.items || []) {
                    segments.push(...collectBlockSegments(item.tokens || createFallbackTextTokens(item.text)))
                }
                break
            }
            case "table": {
                for (const cell of token.header || []) {
                    const text = collectInlineText(cell.tokens || createFallbackTextTokens(cell.text))
                    if (text) {
                        segments.push(text)
                    }
                }

                for (const row of token.rows || []) {
                    for (const cell of row) {
                        const text = collectInlineText(cell.tokens || createFallbackTextTokens(cell.text))
                        if (text) {
                            segments.push(text)
                        }
                    }
                }
                break
            }
            case "blockquote": {
                segments.push(...collectBlockSegments(token.tokens || createFallbackTextTokens(token.text)))
                break
            }
            case "html": {
                const text = extractVisibleTextFromHtml(token.raw || token.text || "")
                if (text) {
                    segments.push(text)
                }
                break
            }
            default: {
                const text = collectInlineText(token.tokens || [token])
                if (text) {
                    segments.push(text)
                }
                break
            }
        }
    }

    return segments
}

/**
 * collectInlineText 提取 inline token 中用户可见的文本, 保留语义文本并跳过图片等噪声内容.
 * @param tokens Markdown inline token 列表.
 * @returns 拼接后的可见文本.
 */
function collectInlineText(tokens: MarkdownToken[]): string {
    let result = ""

    for (const token of tokens) {
        switch (token.type) {
            case "space":
            case "br": {
                result += " "
                break
            }
            case "image": {
                break
            }
            case "html": {
                result += extractVisibleTextFromHtml(token.raw || token.text || "")
                break
            }
            default: {
                if (token.tokens?.length) {
                    result += collectInlineText(token.tokens)
                    break
                }

                if (typeof token.text === "string") {
                    result += token.text
                }
                break
            }
        }
    }

    return result
}

/**
 * extractVisibleTextFromHtml 从原始 HTML token 中抽取可见文本, 并移除代码块及编辑器控制节点.
 * @param html Markdown 中的原始 HTML 片段.
 * @returns 可见纯文本.
 */
function extractVisibleTextFromHtml(html: string): string {
    if (!html.trim()) {
        return ""
    }

    if (typeof document === "undefined") {
        return normalizeSeoText(
            html
                .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
                .replace(/<code[\s\S]*?<\/code>/gi, " ")
                .replace(/<script[\s\S]*?<\/script>/gi, " ")
                .replace(/<style[\s\S]*?<\/style>/gi, " ")
                .replace(/<[^>]+>/g, " "),
        )
    }

    const container = document.createElement("div")
    container.innerHTML = html
    container.querySelectorAll(skippedHtmlSelectors.join(", ")).forEach((element) => element.remove())
    container.querySelectorAll(htmlBlockSelectors.join(", ")).forEach((element) => {
        element.before(document.createTextNode(" "))
        element.after(document.createTextNode(" "))
    })
    const text = normalizeSeoText(container.textContent || "")
    container.remove()
    return text
}

/**
 * normalizeSeoText 统一 SEO 描述中的空白字符, 避免换行和多个空格污染摘要.
 * @param text 原始文本.
 * @returns 规范化后的单行文本.
 */
function normalizeSeoText(text: string): string {
    return text
        .replace(/\u00a0/g, " ")
        .replace(/\s+/g, " ")
        .trim()
}

/**
 * truncateTextByCodePoint 按 Unicode code point 截断文本, 避免截断代理对字符.
 * @param text 待截断文本.
 * @param maxLength 最大字符数.
 * @returns 截断后的文本.
 */
function truncateTextByCodePoint(text: string, maxLength: number): string {
    return Array.from(text).slice(0, maxLength).join("").trim()
}

/**
 * createFallbackTextTokens 为缺少 tokens 的场景补一个最小 text token, 保证递归逻辑统一.
 * @param text 待包装文本.
 * @returns 最小 token 数组.
 */
function createFallbackTextTokens(text?: string): MarkdownToken[] {
    return text ? [{ type: "text", text }] : []
}
