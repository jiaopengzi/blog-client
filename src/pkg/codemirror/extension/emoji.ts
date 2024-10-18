/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-21 23:01:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-25 22:17:40
 * @FilePath     : \blog-client\src\pkg\codemirror\extension\emoji.ts
 * @Description  : emoji 补全
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { CompletionContext } from "@codemirror/autocomplete"
import type { CompletionResult } from "@codemirror/autocomplete"
import emojiCompletionList from "@/utils/emoji"

/**
 * @description: emoji 补全
 * @param context 上下文
 * @return {CompletionResult | null} 补全结果
 */
export function emojiCompletions(context: CompletionContext): CompletionResult | null {
    const keywords = context.matchBefore(/:[-_0-9a-zA-Z\s]+/) // 正字匹配 :开始的内容包括空格 - _ 数字 字母
    if (!keywords) return null // 如果没有匹配到则不补全
    if (keywords.from === keywords.to && !context.explicit) return null // 如果没有输入内容则不补全
    return {
        from: keywords.from,
        options: emojiCompletionList,
    }
}
