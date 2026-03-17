/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\rule\005.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 规则 005 检测付费标签是否合法(成对闭合、属性完整、标签前后空行)
 */

import type { Diagnostic } from "@codemirror/lint"

import { parseAttributes } from "@/utils/attribute"

import type { AttrContext, DocLike } from "../types"
import {
    collectFencedCodeLineNumbers,
    validateBlankLinesForPair,
    validateEmptyContent,
    validateNoNestedCustomTags,
    validateNoSurroundingContent,
    validateSingleLineForPair,
} from "../utils"

export const id = "rule005"
export const defaultOptions = {}

/**
 * run: 检查文档中付费标签的合法性, 包括成对闭合、属性完整、标签前后空行等, 若存在不合法情况则返回 error 类型的 Diagnostic

<pay-video>
除视频外的其他隐藏内容, 如附件下载等；若没有则将标签设置为一行
</pay-video>

<pay-membership></pay-membership>

<pay-read>
您付费阅读的内容
</pay-read>

<pay-download>
您的付费下载内容
</pay-download>

<pay-key id="您的key" title="您的标题" description="您的说明"></pay-key>

 * @param doc - 文档对象, 提供 lines 和 line(i) 方法
 * @returns Diagnostic[] 如果存在不合法的付费标签, 返回对应行的 Diagnostic
 */
export function run(doc: DocLike): Diagnostic[] {
    const diagnostics: Diagnostic[] = []
    const lineCount = doc.lines
    const fencedLineNumbers = collectFencedCodeLineNumbers(doc)

    // 正则同时匹配开始和结束标签, 并捕获开始标签的属性部分
    const payTagRegex = /<pay-(video|membership|read|download|key)(\s+[^>]*)?>|<\/pay-(video|membership|read|download|key)>/g

    // 保存开始标签的栈, 包含位置和属性信息
    const tagStack: Array<{ tag: string; line: number; fromIndex: number; length: number; attrs: string }> = []

    // 遍历每一行, 识别标签并进行配对与校验
    for (let i = 1; i <= lineCount; i++) {
        if (fencedLineNumbers.has(i)) {
            continue
        }

        const lineText = doc.line(i).text
        let match: RegExpExecArray | null
        payTagRegex.lastIndex = 0 // 重置正则状态

        // 查找当前行中的所有付费标签
        while ((match = payTagRegex.exec(lineText)) !== null) {
            const fullMatch = match[0]
            const isClosing = fullMatch.startsWith("</")
            // 通用检查：开始标签前/结束标签后不能有同一行内的其它内容
            validateNoSurroundingContent({
                doc,
                lineText,
                lineNum: i,
                matchIndex: match.index,
                fullLength: fullMatch.length,
                tagOrFullMatch: isClosing ? fullMatch : (match[1] as string),
                isClosing,
                diagnostics,
                sourceId: id,
            })
            if (isClosing) {
                // 提取 tagName(保留 pay- 前缀), 与栈顶匹配
                const tagName = fullMatch.replace(/^<\//, "").replace(/>$/, "")

                // 获取栈顶开始标签
                const top = tagStack[tagStack.length - 1]

                // 未匹配或顺序错误
                if (!top || top.tag !== tagName) {
                    diagnostics.push({
                        from: doc.line(i).from + match.index,
                        to: doc.line(i).from + match.index + fullMatch.length,
                        severity: "error",
                        message: `标签未闭合或顺序错误：${fullMatch}`,
                        source: id,
                    })
                } else {
                    // 匹配成功, 弹出并分别校验属性与空行规则
                    const open = tagStack.pop() as (typeof tagStack)[0]
                    const openLn = open.line
                    const closeLn = i
                    const openFrom = doc.line(openLn).from + open.fromIndex
                    const openTo = openFrom + open.length
                    const closeFrom = doc.line(closeLn).from + match.index
                    const closeTo = closeFrom + fullMatch.length

                    // 如果是 pay-key, 校验属性(open.tag 现在为完整标签名, 如 pay-key)
                    if (open.tag === "pay-key") {
                        validateAttributesForKey({ doc, attrsText: open.attrs, openFrom, openTo, diagnostics, sourceId: id })
                    }

                    // 自定义标签内部不允许再嵌套任何项目自定义标签。
                    const hasNestedCustomTags = validateNoNestedCustomTags({
                        doc,
                        openLine: openLn,
                        closeLine: closeLn,
                        openFromIndex: open.fromIndex,
                        openLength: open.length,
                        closeMatchIndex: match.index,
                        tagName: open.tag,
                        ignoredLineNumbers: fencedLineNumbers,
                        diagnostics,
                        sourceId: id,
                    })

                    // 对于 pay-key 和 pay-membership 要求标签内不能有内容(必须为空)
                    if ((open.tag === "pay-key" || open.tag === "pay-membership") && !hasNestedCustomTags) {
                        validateEmptyContent({
                            doc,
                            openLine: openLn,
                            closeLine: closeLn,
                            openFromIndex: open.fromIndex,
                            openLength: open.length,
                            closeMatchIndex: match.index,
                            tagName: open.tag,
                            diagnostics,
                            sourceId: id,
                        })
                    }

                    // 成对标签空行要求
                    const opts = {
                        doc,
                        lineCount,
                        openLine: openLn,
                        closeLine: closeLn,
                        tagName: open.tag,
                        openFrom,
                        openTo,
                        closeFrom,
                        closeTo,
                        diagnostics,
                        sourceId: id,
                    }
                    // 成对标签前后空行要求
                    validateBlankLinesForPair(opts)

                    // 单行要求, 当 tag 属于 singleLineTags 时调用
                    const singleLineTags = new Set(["pay-key", "pay-membership"])
                    if (singleLineTags.has(open.tag)) {
                        validateSingleLineForPair(opts)
                    }
                }
            } else {
                // 开始标签, 记录位置与属性。保存完整标签名(包含 pay- 前缀)
                const tagName = `pay-${match[1] as string}`
                const attrsText = match[2] ? match[2] : ""
                tagStack.push({ tag: tagName, line: i, fromIndex: match.index, length: fullMatch.length, attrs: attrsText })
            }
        }
    }

    // 处理未闭合的开始标签
    for (const unclosedTag of tagStack) {
        const ln = doc.line(unclosedTag.line)
        diagnostics.push({
            from: ln.from + unclosedTag.fromIndex,
            to: ln.from + unclosedTag.fromIndex + unclosedTag.length,
            severity: "error",
            message: `标签未闭合：<${unclosedTag.tag}>`,
            source: id,
        })
    }

    return diagnostics
}

/**
 * 校验付费 key 标签属性要求
 * @param ctx - 上下文对象
 * @return void
 */
export function validateAttributesForKey(ctx: AttrContext) {
    const { attrsText, openFrom, openTo, diagnostics, sourceId } = ctx
    const attrs = parseAttributes(attrsText)
    if (!attrs.id || attrs.id.trim() === "") {
        diagnostics.push({
            from: openFrom,
            to: openTo,
            severity: "error",
            message: "标签缺少属性: id",
            source: sourceId,
        })
    }
}

// 导出规则模块
export default { id, defaultOptions, run }
