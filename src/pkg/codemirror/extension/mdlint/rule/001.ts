/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\rule\001.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 规则 001 检测行尾多余空格
 */

import type { Diagnostic } from "@codemirror/lint"

import type { DocLike } from "../types"

export const id = "rule001"
export const defaultOptions = {}

/**
 * run: 检测文档每一行的行尾多余空格
 * @param doc - 提供 lines 和 line(i) 方法的文档对象
 * @returns Diagnostic[] 检测到的问题数组, 每项包含 from, to, severity, message, source
 */
export function run(doc: DocLike): Diagnostic[] {
    const diagnostics: Diagnostic[] = []
    const lineCount = doc.lines

    // 遍历所有行并匹配行尾空白字符
    for (let i = 1; i <= lineCount; i++) {
        const line = doc.line(i)
        const text = line.text
        const to = line.to

        // 匹配行尾的空白字符
        const trailingMatch = text.match(/(\s+)$/)
        if (trailingMatch) {
            const len = trailingMatch[0]?.length ?? 0
            if (len > 0) {
                diagnostics.push({
                    from: to - len,
                    to: to,
                    severity: "warning",
                    message: "行尾存在多余空格",
                    source: id,
                })
            }
        }
    }

    return diagnostics
}

export default { id, defaultOptions, run }
