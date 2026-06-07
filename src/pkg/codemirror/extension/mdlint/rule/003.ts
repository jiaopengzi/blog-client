/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\rule\003.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 规则 003 检测标题级别跳跃, 如从 H1 直接跳到 H3
 */

import type { Diagnostic } from "@codemirror/lint"

import type { DocLike } from "../types"
import { collectFencedCodeLineNumbers } from "../utils"

export const id = "rule003"
export const defaultOptions = {}

/**
 * run: 检查文档中标题级别是否跳跃, 若出现跳跃则返回 warning 类型的 Diagnostic
 * @param doc - 文档对象, 提供 lines 与 line(i) 方法
 * @returns Diagnostic[] 标题级别跳跃的位置数组
 */
export function run(doc: DocLike): Diagnostic[] {
    const diagnostics: Diagnostic[] = []
    const lineCount = doc.lines
    const fencedLineNumbers = collectFencedCodeLineNumbers(doc)
    let prevHeadingLevel = 0

    // 遍历每一行, 匹配 Markdown 标题语法并比较级别
    for (let i = 1; i <= lineCount; i++) {
        if (fencedLineNumbers.has(i)) {
            continue
        }

        const line = doc.line(i)
        const text = line.text
        const from = line.from

        const headingMatch = text.match(/^(#{1,6})\s+/)
        if (headingMatch) {
            const grp = headingMatch[1] ?? ""
            const level = grp.length
            // 若存在上一个标题级别, 并且当前级别较上一个跳跃超过 1, 则视为跳跃
            if (prevHeadingLevel && level - prevHeadingLevel > 1) {
                diagnostics.push({
                    from: from,
                    to: from + grp.length,
                    severity: "warning",
                    message: `标题级跳跃：上一个标题为 ${prevHeadingLevel}, 当前为 ${level}`,
                    source: id,
                })
            }
            prevHeadingLevel = level
        }
    }

    return diagnostics
}

export default { id, defaultOptions, run }
