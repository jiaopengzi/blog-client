/**
 * FilePath    : blog-client\src\pkg\marked\extension\emoji.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 扩展 marked 的解析器, 支持 emoji 官方短码与 GitHub 风格别名
 */

import emojiJson from "emoji.json"
import type { Tokens, TokenizerAndRendererExtension } from "marked"

import { buildEmojiDictionaryMaps, normalizeEmojiCode, normalizeEmojiKey, type EmojiDictionaryItem } from "@/utils/emojiDictionary"
import { githubStyleEmojiAliasCodeMap } from "@/utils/emojiGithubAliases"

type EmojiToken = Tokens.Generic & {
    type: "emoji"
    name: string
    emoji: string
}

/**
 * registerEmojiKeyVariants 为同一 emoji 注册空格, 下划线, 中横线三种短码变体.
 * @param dictionary - emoji 字典.
 * @param rawKey - 原始短码或名称.
 * @param emoji - 对应的 emoji 字符.
 */
function registerEmojiKeyVariants(dictionary: Record<string, string>, rawKey: string, emoji: string): void {
    const normalizedKey = normalizeEmojiKey(rawKey)
    const variantKeys = [normalizedKey, normalizedKey.replace(/\s+/g, "_"), normalizedKey.replace(/\s+/g, "-")]

    variantKeys.forEach((variantKey) => {
        const currentEmoji = dictionary[variantKey]
        if (currentEmoji && currentEmoji.length >= emoji.length) {
            return
        }

        dictionary[variantKey] = emoji
    })
}

/**
 * registerEmojiAliasesByCode 按 Unicode 码位为 emoji 字典注册 GitHub 风格短码.
 * @param dictionary - emoji 名称与短码字典.
 * @param codeDictionary - Unicode 码位到 emoji 字符的字典.
 * @param aliasCodeMap - GitHub 风格短码到 Unicode 码位的映射表.
 */
function registerEmojiAliasesByCode(
    dictionary: Record<string, string>,
    codeDictionary: Record<string, string>,
    aliasCodeMap: Readonly<Record<string, string>>,
): void {
    Object.entries(aliasCodeMap).forEach(([alias, code]) => {
        const emoji = codeDictionary[normalizeEmojiCode(code)]
        if (!emoji) {
            return
        }

        registerEmojiKeyVariants(dictionary, alias, emoji)
    })
}

// 仅在模块初始化时构建一次 emoji 字典, 避免每次创建 Marked 实例时重复遍历全量 emoji 列表.
const { codeToEmojiMap: emojiCodeMap, officialNameToEmojiMap } = buildEmojiDictionaryMaps(emojiJson as EmojiDictionaryItem[])

const emojiMap: Record<string, string> = Object.entries(officialNameToEmojiMap).reduce<Record<string, string>>((result, [officialName, emoji]) => {
    registerEmojiKeyVariants(result, officialName, emoji)

    return result
}, {})

registerEmojiAliasesByCode(emojiMap, emojiCodeMap, githubStyleEmojiAliasCodeMap)

// 轻量候选匹配规则: 只识别单行 :shortcode: 形态, 不再为全部 emoji 名称拼接超长正则.
const emojiTokenizerRule = /^:([^:\n]{1,80}):/
const emojiCandidateRule = /:([^:\n]{1,80}):/

/**
 * emojiExtensionInline 以 map 查表方式解析 :smile: 这类短码.
 * @returns Marked inline 扩展对象; 命中已知短码时返回真实 emoji 字符, 未命中时保留原始文本.
 */
export const emojiExtensionInline: TokenizerAndRendererExtension = {
    name: "emoji",
    level: "inline",
    start(src: string): number | undefined {
        return src.match(emojiCandidateRule)?.index
    },
    tokenizer(src: string): EmojiToken | undefined {
        const match = emojiTokenizerRule.exec(src)
        if (!match) {
            return
        }

        const name = normalizeEmojiKey(match[1]!)
        const emoji = emojiMap[name]
        if (!emoji) {
            return
        }

        return {
            type: "emoji",
            raw: match[0],
            name,
            emoji,
        }
    },
    renderer(token): string {
        return (token as unknown as EmojiToken).emoji
    },
}

export default emojiExtensionInline
