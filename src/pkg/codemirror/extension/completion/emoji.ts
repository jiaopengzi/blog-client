/*
 * FilePath    : blog-client\src\pkg\codemirror\extension\completion\emoji.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : emoji 补全
 */

import type { Completion } from "@codemirror/autocomplete"
import type { CompletionResult } from "@codemirror/autocomplete"
import { CompletionContext } from "@codemirror/autocomplete"
import emojiJson from "emoji.json"

/*
emoji 补全列表

[
  { label: '😃 smiley0', apply: '😃' },
  { label: '😃 smiley1', apply: '😃' },
]
*/

function generateEmojiCompletionList() {
    const emojiList: Completion[] = []

    // 循环遍历 emojiJson 生成 emojiList
    emojiJson.forEach((item) => {
        item.name = item.name.replace(/:/g, "") // 替换掉 item.name 中的:
        const emoji: Completion = { label: item.char + " :" + item.name, apply: item.char }
        emojiList.push(emoji)
    })

    return emojiList
}

// 使用单例模式确保只生成一次 emojiCompletionList
const emojiCompletionList = generateEmojiCompletionList()

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
