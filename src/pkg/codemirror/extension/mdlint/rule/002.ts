/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\rule\002.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 规则 002 检测行长度超过指定阈值
 */

import type { Diagnostic } from "@codemirror/lint"

import type { DocLike } from "../types"

export const id = "rule002"
export const defaultOptions = { maxLineLength: 120 }

/**
 * run: 检测每一行是否超过最大长度
 * @param doc - 文档对象, 提供 lines 和 line(i) 方法
 * @param opts - 可选配置, 支持 maxLineLength
 * @returns Diagnostic[] 超出长度的行会产生 warning 级别的 Diagnostic
 */
export function run(doc: DocLike, opts: { maxLineLength?: number } = {}): Diagnostic[] {
    const diagnostics: Diagnostic[] = []
    const maxLineLength = opts.maxLineLength ?? defaultOptions.maxLineLength
    const lineCount = doc.lines

    // 遍历每一行, 若长度超过 maxLineLength, 则记录 Diagnostic
    for (let i = 1; i <= lineCount; i++) {
        const line = doc.line(i)
        const text = line.text
        const from = line.from
        const to = line.to

        if (text.length > maxLineLength) {
            diagnostics.push({
                from: from + maxLineLength,
                to: to,
                severity: "warning",
                message: `行长度超过 ${maxLineLength} 字符`,
                source: id,
            })
        }
    }

    return diagnostics
}

export default { id, defaultOptions, run }
