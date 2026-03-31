/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\rule\007.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 规则 007 标题行前后必须有空行
 */

import type { Diagnostic } from "@codemirror/lint"

import type { DocLike } from "../types"

export const id = "rule007"
export const defaultOptions = {}

/**
 * run: 检查文档中标题行前后是否有空行, 若无则返回 warning 类型的 Diagnostic
 * @param doc - 文档对象, 提供 lines 与 line(i) 方法
 * @returns Diagnostic[] 标题行前后无空行的位置数组
 */
export function run(doc: DocLike): Diagnostic[] {
    const diagnostics: Diagnostic[] = []
    const lineCount = doc.lines

    for (let i = 1; i <= lineCount; i++) {
        const line = doc.line(i)
        const text = line.text
        const from = line.from

        const headingMatch = text.match(/^(#{1,6})\s+/)
        if (headingMatch) {
            const grp = headingMatch[1] ?? ""
            const level = grp.length

            // 检查前一行是否为空（若存在前一行）
            if (i > 1) {
                const prev = doc.line(i - 1).text
                if (prev.trim() !== "") {
                    diagnostics.push({
                        from: from,
                        to: from + grp.length,
                        severity: "warning",
                        message: `标题前应有空行：当前级别 ${level}`,
                        source: id,
                    })
                }
            }

            // 检查下一行是否为空（若存在下一行）
            if (i < lineCount) {
                const next = doc.line(i + 1).text
                if (next.trim() !== "") {
                    diagnostics.push({
                        from: from,
                        to: from + grp.length,
                        severity: "warning",
                        message: `标题后应有空行：当前级别 ${level}`,
                        source: id,
                    })
                }
            }
        }
    }

    return diagnostics
}

export default { id, defaultOptions, run }
