/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\rule\006.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 规则 006 检测 video-player 标签是否合法(成对闭合、属性完整、标签前后空行)
 */

import type { Diagnostic } from "@codemirror/lint"

// 导入的时候不能使用 @/components/player, 会导致测试错误引用，需要相对完整路径
import { MediaTypes } from "@/components/player/types"
import { parseAttributes } from "@/utils/attribute"

import type { AttrContext, DocLike, VideoPlayerAttrs } from "../types"
import {
    collectFencedCodeLineNumbers,
    isInsideInlineCode,
    validateBlankLinesForPair,
    validateEmptyContent,
    validateNoNestedCustomTags,
    validateNoSurroundingContent,
    validateSingleLineForPair,
} from "../utils"

export const id = "rule006"
export const defaultOptions = {}

/**
 * run: 检查文档中 video-player 标签的合法性, 包括成对闭合、属性完整、标签前后空行等, 若存在不合法情况则返回 error 类型的 Diagnostic

<video-player video-type="hls" src="" poster="" id=""></video-player>

 * @param doc - 文档对象, 提供 lines 和 line(i) 方法
 * @returns Diagnostic[] 如果存在不合法的 video-player 标签, 返回对应行的 Diagnostic
 */
export function run(doc: DocLike): Diagnostic[] {
    const diagnostics: Diagnostic[] = []
    const lineCount = doc.lines
    const fencedLineNumbers = collectFencedCodeLineNumbers(doc)

    // 匹配开始和结束标签, 捕获开始标签的属性部分
    const tagRegex = /<video-player(\s+[^>]*)?>|<\/video-player>/g

    const stack: Array<{ line: number; fromIndex: number; length: number; attrs: string }> = []

    for (let i = 1; i <= lineCount; i++) {
        if (fencedLineNumbers.has(i)) {
            continue
        }

        const lineText = doc.line(i).text
        let match: RegExpExecArray | null
        tagRegex.lastIndex = 0

        while ((match = tagRegex.exec(lineText)) !== null) {
            // 跳过行内代码片段（单个反引号包裹）中的标签
            if (isInsideInlineCode(lineText, match.index)) continue
            const fullMatch = match[0]
            const isClosing = fullMatch.startsWith("</")

            // 检查同一行前后不应有其它内容
            validateNoSurroundingContent({
                doc,
                lineText,
                lineNum: i,
                matchIndex: match.index,
                fullLength: fullMatch.length,
                tagOrFullMatch: isClosing ? fullMatch : "video-player",
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
                        message: `video-player 标签未闭合或顺序错误：${fullMatch}`,
                        source: id,
                    })
                } else {
                    const open = stack.pop() as (typeof stack)[0]
                    const openLn = open.line
                    const closeLn = i
                    const openFrom = doc.line(openLn).from + open.fromIndex
                    const openTo = openFrom + open.length
                    const closeFrom = doc.line(closeLn).from + match.index
                    const closeTo = closeFrom + fullMatch.length

                    // 校验属性: 必须有 video-type, 且 id 或 src 至少其一
                    validateAttributesForVideoPlayer({ doc, attrsText: open.attrs, openFrom, openTo, diagnostics, sourceId: id })

                    // video-player 内部不允许出现任何项目自定义标签.
                    const hasNestedCustomTags = validateNoNestedCustomTags({
                        doc,
                        openLine: openLn,
                        closeLine: closeLn,
                        openFromIndex: open.fromIndex,
                        openLength: open.length,
                        closeMatchIndex: match.index,
                        tagName: "video-player",
                        ignoredLineNumbers: fencedLineNumbers,
                        diagnostics,
                        sourceId: id,
                    })

                    // 要求标签内容为空
                    if (!hasNestedCustomTags) {
                        validateEmptyContent({
                            doc,
                            openLine: openLn,
                            closeLine: closeLn,
                            openFromIndex: open.fromIndex,
                            openLength: open.length,
                            closeMatchIndex: match.index,
                            tagName: "video-player",
                            diagnostics,
                            sourceId: id,
                        })
                    }

                    // 校验前后空行
                    const opts = {
                        doc,
                        lineCount,
                        openLine: openLn,
                        closeLine: closeLn,
                        tagName: "video-player",
                        openFrom,
                        openTo,
                        closeFrom,
                        closeTo,
                        diagnostics,
                        sourceId: id,
                    }

                    validateBlankLinesForPair(opts)

                    // 单行要求
                    validateSingleLineForPair(opts)
                }
            } else {
                const attrsText = match[1] ? match[1] : ""
                stack.push({ line: i, fromIndex: match.index, length: fullMatch.length, attrs: attrsText })
            }
        }
    }

    // 未闭合的开始标签
    for (const unclosed of stack) {
        const ln = doc.line(unclosed.line)
        diagnostics.push({
            from: ln.from + unclosed.fromIndex,
            to: ln.from + unclosed.fromIndex + unclosed.length,
            severity: "error",
            message: `video-player 标签未闭合：<video-player>`,
            source: id,
        })
    }

    return diagnostics
}

// 校验 video-player 属性要求
function validateAttributesForVideoPlayer(ctx: AttrContext) {
    // 解构参数
    const { attrsText, openFrom, openTo, diagnostics, sourceId } = ctx

    // 解析属性
    const raw = parseAttributes(attrsText)

    // 构造属性对象
    const attrs: VideoPlayerAttrs = {
        "video-type": raw["video-type"],
        id: raw.id,
        src: raw.src,
        poster: raw.poster,
    }

    // video-type 不为空
    if (!attrs["video-type"] || attrs["video-type"].trim() === "") {
        diagnostics.push({ from: openFrom, to: openTo, severity: "error", message: "video-player 缺少属性: video-type", source: sourceId })
    }

    // video-type 值合法性
    if (!Object.values(MediaTypes).includes(attrs["video-type"] as MediaTypes)) {
        const validValues = Object.values(MediaTypes).join(", ")

        diagnostics.push({
            from: openFrom,
            to: openTo,
            severity: "error",
            message: `video-player 属性 video-type 值不合法: ${attrs["video-type"]}, 合法值为: ${validValues}`,
            source: sourceId,
        })
    }

    // 当 video-type 为 hls 时, id 属性不能为空; 当 video-type 为其他类型时, src 属性不能为空
    if (attrs["video-type"] === MediaTypes.HLS) {
        if (!attrs.id || attrs.id.trim() === "") {
            diagnostics.push({ from: openFrom, to: openTo, severity: "error", message: "video-player video-type 为 hls 时, id 属性不能为空", source: sourceId })
        }
    } else {
        if (!attrs.src || attrs.src.trim() === "") {
            diagnostics.push({
                from: openFrom,
                to: openTo,
                severity: "error",
                message: `video-player src 属性不能为空`,
                source: sourceId,
            })
        }
    }
}

// 导出规则模块
export default { id, defaultOptions, run }
