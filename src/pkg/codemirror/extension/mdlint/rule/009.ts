/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\rule\009.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 规则 009 检测 wechat-captcha 标签是否合法(成对闭合、属性完整、标签前后空行)
 */
import type { Diagnostic } from "@codemirror/lint"

import { parseAttributes } from "@/utils/attribute"

import type { AttrContext, DocLike, WechatCaptchaAttrs } from "../types"
import { collectFencedCodeLineNumbers, validateBlankLinesForPair, validateNoSurroundingContent } from "../utils"

export const id = "rule009"
export const defaultOptions = {}

export function run(doc: DocLike): Diagnostic[] {
    const diagnostics: Diagnostic[] = []
    const lineCount = doc.lines
    const fencedLineNumbers = collectFencedCodeLineNumbers(doc)
    const tagRegex = /<wechat-captcha(\s+[^>]*)?>|<\/wechat-captcha>/g
    const stack: Array<{ line: number; fromIndex: number; length: number; attrs: string }> = []

    for (let i = 1; i <= lineCount; i++) {
        if (fencedLineNumbers.has(i)) {
            continue
        }

        const lineText = doc.line(i).text
        let match: RegExpExecArray | null
        tagRegex.lastIndex = 0

        while ((match = tagRegex.exec(lineText)) !== null) {
            const fullMatch = match[0]
            const isClosing = fullMatch.startsWith("</")

            validateNoSurroundingContent({
                doc,
                lineText,
                lineNum: i,
                matchIndex: match.index,
                fullLength: fullMatch.length,
                tagOrFullMatch: isClosing ? fullMatch : "wechat-captcha",
                isClosing,
                diagnostics,
                sourceId: id,
            })

            if (isClosing) {
                const top = stack[stack.length - 1]
                if (!top) {
                    diagnostics.push({
                        from: doc.line(i).from + match.index,
                        to: doc.line(i).from + match.index + fullMatch.length,
                        severity: "error",
                        message: `wechat-captcha 标签未闭合或顺序错误：${fullMatch}`,
                        source: id,
                    })
                    continue
                }

                const open = stack.pop() as (typeof stack)[0]
                const openLn = open.line
                const closeLn = i
                const openFrom = doc.line(openLn).from + open.fromIndex
                const openTo = openFrom + open.length
                const closeFrom = doc.line(closeLn).from + match.index
                const closeTo = closeFrom + fullMatch.length

                validateAttributesForWechatCaptcha({
                    doc,
                    attrsText: open.attrs,
                    openFrom,
                    openTo,
                    diagnostics,
                    sourceId: id,
                })

                validateNoNestedWechatCaptcha({
                    doc,
                    openLine: openLn,
                    closeLine: closeLn,
                    openFromIndex: open.fromIndex,
                    openLength: open.length,
                    closeMatchIndex: match.index,
                    diagnostics,
                    sourceId: id,
                    ignoredLineNumbers: fencedLineNumbers,
                })

                validateBlankLinesForPair({
                    doc,
                    lineCount,
                    openLine: openLn,
                    closeLine: closeLn,
                    tagName: "wechat-captcha",
                    openFrom,
                    openTo,
                    closeFrom,
                    closeTo,
                    diagnostics,
                    sourceId: id,
                })
            } else {
                const attrsText = match[1] ? match[1] : ""
                stack.push({ line: i, fromIndex: match.index, length: fullMatch.length, attrs: attrsText })
            }
        }
    }

    for (const unclosed of stack) {
        const line = doc.line(unclosed.line)
        diagnostics.push({
            from: line.from + unclosed.fromIndex,
            to: line.from + unclosed.fromIndex + unclosed.length,
            severity: "error",
            message: "wechat-captcha 标签未闭合：<wechat-captcha>",
            source: id,
        })
    }

    return diagnostics
}

function validateAttributesForWechatCaptcha(ctx: AttrContext) {
    const { attrsText, openFrom, openTo, diagnostics, sourceId } = ctx
    const raw = parseAttributes(attrsText)
    const attrs: WechatCaptchaAttrs = {
        name: raw.name,
        codeurl: raw.codeurl,
        key: raw.key,
        reply: raw.reply,
    }

    ;(["name", "codeurl", "key", "reply"] as const).forEach((field) => {
        const value = attrs[field]
        if (!value || value.trim() === "") {
            diagnostics.push({
                from: openFrom,
                to: openTo,
                severity: "error",
                message: `wechat-captcha 缺少属性或属性为空: ${field}`,
                source: sourceId,
            })
        }
    })
}

function validateNoNestedWechatCaptcha(ctx: {
    doc: DocLike
    openLine: number
    closeLine: number
    openFromIndex: number
    openLength: number
    closeMatchIndex: number
    diagnostics: Diagnostic[]
    sourceId: string
    ignoredLineNumbers?: Set<number>
}) {
    const { doc, openLine, closeLine, openFromIndex, openLength, closeMatchIndex, diagnostics, sourceId, ignoredLineNumbers } = ctx
    const selfTagRegex = /<\/?wechat-captcha(?:\s+[^>]*)?>/g

    for (let lineNum = openLine; lineNum <= closeLine; lineNum++) {
        if (ignoredLineNumbers?.has(lineNum)) {
            continue
        }

        const line = doc.line(lineNum)
        const start = lineNum === openLine ? openFromIndex + openLength : 0
        const end = lineNum === closeLine ? closeMatchIndex : line.text.length
        const segment = line.text.slice(start, end)

        if (!segment) {
            continue
        }

        selfTagRegex.lastIndex = 0
        let match: RegExpExecArray | null
        while ((match = selfTagRegex.exec(segment)) !== null) {
            diagnostics.push({
                from: line.from + start + match.index,
                to: line.from + start + match.index + match[0].length,
                severity: "error",
                message: `wechat-captcha 标签内不允许嵌套同名标签: ${match[0]}`,
                source: sourceId,
            })
        }
    }
}

export default { id, defaultOptions, run }
