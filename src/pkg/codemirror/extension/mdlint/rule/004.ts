/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\rule\004.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 规则 004 检测代码块是否成对闭合, 即 ``` 的数量是否为偶数
 */

import type { Diagnostic } from "@codemirror/lint"

import type { DocLike } from "../types"

export const id = "rule004"
export const defaultOptions = {}

/**
 * run: 检查文档中代码块的围栏是否闭合, 若出现未闭合情况则返回 error 类型的 Diagnostic
 * @param doc - 文档对象, 提供 lines 和 line(i) 方法
 * @returns Diagnostic[] 如果代码块未闭合, 返回最后一个未匹配的围栏行的 Diagnostic
 */
export function run(doc: DocLike): Diagnostic[] {
    const diagnostics: Diagnostic[] = []
    const lineCount = doc.lines

    const fenceRegex = /^```/
    let fenceCount = 0
    // 统计围栏出现的次数
    for (let i = 1; i <= lineCount; i++) {
        if (fenceRegex.test(doc.line(i).text)) fenceCount++
    }
    // 若为奇数, 则存在未闭合的代码块, 报告最后一个围栏行为 error
    if (fenceCount % 2 === 1) {
        for (let i = lineCount; i >= 1; i--) {
            const ln = doc.line(i)
            if (fenceRegex.test(ln.text)) {
                diagnostics.push({
                    from: ln.from,
                    to: ln.to,
                    severity: "error",
                    message: "代码块未闭合：缺少 ```",
                    source: id,
                })
                break
            }
        }
    }

    return diagnostics
}

export default { id, defaultOptions, run }
