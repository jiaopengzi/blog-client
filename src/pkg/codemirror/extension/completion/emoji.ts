/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\completion\emoji.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : emoji 补全
 */

import type { CompletionResult } from "@codemirror/autocomplete"
import { CompletionContext } from "@codemirror/autocomplete"

import emojiCompletionList from "@/utils/emoji"

const emojiKeywordRule = /:[-+_0-9a-zA-Z][-+_0-9a-zA-Z\s]*$/
const completedEmojiShortcodeBodyRule = /^[-+_0-9a-zA-Z][-+_0-9a-zA-Z\s]*$/

/**
 * isClosedEmojiShortcodeColon 判断当前候选起始冒号是否其实是上一个 emoji 短码的闭合冒号.
 * 例如 `:smile: kai` 中, 光标继续向后输入时, 不应把第二个 `:` 重新视为新的补全起点.
 * @param linePrefix - 当前行在光标前的文本.
 * @param keywordIndex - 当前候选起始冒号在 linePrefix 中的下标.
 * @returns true 表示该冒号属于已闭合短码的结束边界.
 */
function isClosedEmojiShortcodeColon(linePrefix: string, keywordIndex: number): boolean {
    const previousColonIndex = linePrefix.lastIndexOf(":", keywordIndex - 1)
    if (previousColonIndex < 0) {
        return false
    }

    const completedShortcodeBody = linePrefix.slice(previousColonIndex + 1, keywordIndex)
    return completedEmojiShortcodeBodyRule.test(completedShortcodeBody)
}

/**
 * @description: emoji 补全
 * @param context 上下文
 * @return {CompletionResult | null} 补全结果
 */
export function emojiOverride(context: CompletionContext): CompletionResult | null {
    const currentLine = context.state.doc.lineAt(context.pos)
    const linePrefix = currentLine.text.slice(0, context.pos - currentLine.from)
    const keyword = emojiKeywordRule.exec(linePrefix)

    if (!keyword) return null // 如果没有匹配到则不补全
    if (isClosedEmojiShortcodeColon(linePrefix, keyword.index)) return null // 已闭合短码后继续输入普通文本时, 不应再次拉起补全面板

    const keywordFrom = currentLine.from + keyword.index
    if (keywordFrom === context.pos && !context.explicit) return null // 如果没有输入内容则不补全

    return {
        from: keywordFrom,
        options: emojiCompletionList,
    }
}
