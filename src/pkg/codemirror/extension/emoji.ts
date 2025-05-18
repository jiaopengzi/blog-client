/**
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\emoji.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : emoji 补全
 */

import type { CompletionResult } from "@codemirror/autocomplete"
import { CompletionContext } from "@codemirror/autocomplete"

import emojiCompletionList from "@/utils/emoji"

/**
 * @description: emoji 补全
 * @param context 上下文
 * @return {CompletionResult | null} 补全结果
 */
export function emojiOverride(context: CompletionContext): CompletionResult | null {
    const keyword = context.matchBefore(/:[-_0-9a-zA-Z\s]+/) // 正字匹配 :开始的内容包括空格 - _ 数字 字母

    if (!keyword) return null // 如果没有匹配到则不补全
    if (keyword.from === keyword.to && !context.explicit) return null // 如果没有输入内容则不补全

    return {
        from: keyword.from,
        options: emojiCompletionList,
    }
}
