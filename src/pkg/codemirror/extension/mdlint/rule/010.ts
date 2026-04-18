/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\rule\010.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 规则 010 检测 login-view 标签是否合法(成对闭合、标签前后空行)
 */
import type { Diagnostic } from "@codemirror/lint"

import type { DocLike } from "../types"
import { collectFencedCodeLineNumbers, isInsideInlineCode, validateBlankLinesForPair, validateNoSurroundingContent } from "../utils"

export const id = "rule010"
export const defaultOptions = {}

const forbiddenNestedCustomTagRegex = /<\/?(?:pay-(?:video|membership|read|download|key)|power-bi|wechat-captcha|login-view)(?:\s+[^>]*)?>/g

export function run(doc: DocLike): Diagnostic[] {
    const diagnostics: Diagnostic[] = []
    const lineCount = doc.lines
    const fencedLineNumbers = collectFencedCodeLineNumbers(doc)
    const tagRegex = /<login-view>|<\/login-view>/g
    const stack: Array<{ line: number; fromIndex: number; length: number }> = []

    for (let i = 1; i <= lineCount; i++) {
        if (fencedLineNumbers.has(i)) {
            continue
        }

        const lineText = doc.line(i).text
        let match: RegExpExecArray | null
        tagRegex.lastIndex = 0

        while ((match = tagRegex.exec(lineText)) !== null) {
            if (isInsideInlineCode(lineText, match.index)) continue
            const fullMatch = match[0]
            const isClosing = fullMatch.startsWith("</")

            validateNoSurroundingContent({
                doc,
                lineText,
                lineNum: i,
                matchIndex: match.index,
                fullLength: fullMatch.length,
                tagOrFullMatch: isClosing ? fullMatch : "login-view",
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
                        message: `login-view 标签未闭合或顺序错误：${fullMatch}`,
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

                validateLoginViewInnerCustomTags({
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
                    tagName: "login-view",
                    openFrom,
                    openTo,
                    closeFrom,
                    closeTo,
                    diagnostics,
                    sourceId: id,
                })
            } else {
                stack.push({ line: i, fromIndex: match.index, length: fullMatch.length })
            }
        }
    }

    for (const unclosed of stack) {
        const line = doc.line(unclosed.line)
        diagnostics.push({
            from: line.from + unclosed.fromIndex,
            to: line.from + unclosed.fromIndex + unclosed.length,
            severity: "error",
            message: "login-view 标签未闭合：<login-view>",
            source: id,
        })
    }

    return diagnostics
}

function validateLoginViewInnerCustomTags(ctx: {
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

        forbiddenNestedCustomTagRegex.lastIndex = 0
        let match: RegExpExecArray | null
        while ((match = forbiddenNestedCustomTagRegex.exec(segment)) !== null) {
            const message = match[0].includes("login-view")
                ? `login-view 标签内不允许嵌套同名标签: ${match[0]}`
                : `login-view 标签内不允许嵌套自定义标签: ${match[0]}`

            diagnostics.push({
                from: line.from + start + match.index,
                to: line.from + start + match.index + match[0].length,
                severity: "error",
                message,
                source: sourceId,
            })
        }
    }
}

export default { id, defaultOptions, run }
