/**
 * FilePath    : blog-client\src\utils\emoji.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : emoji 补全列表单例, 支持 GitHub 风格 alias
 */

import type { Completion } from "@codemirror/autocomplete"
import emojiJson from "emoji.json"

import { buildEmojiDictionaryMaps, normalizeEmojiCode, normalizeEmojiKey, type EmojiDictionaryItem } from "@/utils/emojiDictionary"
import { githubStyleEmojiAliasCodeMap } from "@/utils/emojiGithubAliases"

/**
 * pushEmojiCompletion 在去重前提下追加一条 emoji 补全项.
 * @param emojiList - 目标补全数组.
 * @param seenShortcodes - 已收录的短码集合.
 * @param shortcode - 要展示的短码.
 * @param emoji - 对应的 emoji 字符.
 * @param detail - 可选的补充说明, 一般用于显示官方名称.
 */
function pushEmojiCompletion(emojiList: Completion[], seenShortcodes: Set<string>, shortcode: string, emoji: string, detail?: string): void {
    const normalizedShortcode = normalizeEmojiKey(shortcode)
    if (seenShortcodes.has(normalizedShortcode)) {
        return
    }

    seenShortcodes.add(normalizedShortcode)
    emojiList.push({
        label: `:${normalizedShortcode}: ${emoji}`,
        apply: emoji,
        detail,
        sortText: normalizedShortcode,
    })
}

/**
 * generateEmojiCompletionList 构建编辑器 emoji 补全列表.
 * 官方名称与 GitHub 风格 alias 共用同一份 emoji 字符, 这样手写 `:smile` 也能命中对应候选项.
 * @returns 供 CodeMirror 自动补全使用的只读 Completion 列表.
 */
function generateEmojiCompletionList(): Completion[] {
    const emojiList: Completion[] = []
    const seenShortcodes = new Set<string>()
    const { codeToEmojiMap, codeToOfficialNameMap, officialNameToEmojiMap } = buildEmojiDictionaryMaps(emojiJson as EmojiDictionaryItem[])

    Object.keys(officialNameToEmojiMap)
        .toSorted((left, right) => left.localeCompare(right))
        .forEach((officialName) => {
            pushEmojiCompletion(emojiList, seenShortcodes, officialName, officialNameToEmojiMap[officialName]!)
        })

    Object.entries(githubStyleEmojiAliasCodeMap)
        .toSorted(([left], [right]) => left.localeCompare(right))
        .forEach(([alias, code]) => {
            const normalizedCode = normalizeEmojiCode(code)
            const emoji = codeToEmojiMap[normalizedCode]
            if (!emoji) {
                return
            }

            pushEmojiCompletion(emojiList, seenShortcodes, alias, emoji, codeToOfficialNameMap[normalizedCode])
        })

    return emojiList
}

// 使用单例模式确保只生成一次 emojiCompletionList
const emojiCompletionList = generateEmojiCompletionList()

export default emojiCompletionList
