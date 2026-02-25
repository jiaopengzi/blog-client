/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\rule\__test__\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 测试专用工具函数
 */

import type { DocLike } from "../../types"

/**
 * 为测试构造一个简单的 DocLike 对象。
 *
 * 注意：此方法仅用于测试环境, 返回的 `from/to` 是基于每行字符串长度的累计偏移量,
 * 可用于模拟 `DocLike.line(i)` 的行为以便对 lint 规则进行单元测试。
 *
 * @param lines - 文本行数组
 * @returns DocLike - 满足 `types.ts` 中 DocLike 约定的对象
 */
export function makeDoc(lines: string[]): DocLike {
    const cum: number[] = []
    let sum = 0
    for (const l of lines) {
        sum += l.length
        cum.push(sum)
    }
    return {
        lines: lines.length,
        line(i: number) {
            const idx = i - 1
            const text = lines[idx]!
            const to = cum[idx]!
            const from = to - text.length
            return { text, from, to }
        },
    }
}

export default { makeDoc }
