/**
 * @FilePath     : \blog-client\src\pkg\marked\extension\emoji.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 扩展 marked 的解析器, 支持 emoji 标记
 */

import emojiJson from "emoji.json"
import type { Tokens, TokenizerAndRendererExtension } from "marked"

interface EmojiDictionaryItem {
    name: string
    char: string
}

type EmojiToken = Tokens.Generic & {
    type: "emoji"
    name: string
    emoji: string
}

/**
 * normalizeEmojiKey 统一 emoji 短码的比较键.
 * @param value 原始短码内容.
 * @returns 归一化后的短码键; 会执行 trim, 转小写, 并压缩连续空白.
 */
function normalizeEmojiKey(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, " ")
}

// 仅在模块初始化时构建一次 emoji 字典, 避免每次创建 Marked 实例时重复遍历全量 emoji 列表.
const emojiMap: Record<string, string> = (emojiJson as EmojiDictionaryItem[]).reduce<Record<string, string>>((result, item) => {
    const normalizedName = normalizeEmojiKey(item.name)

    result[normalizedName] = item.char
    result[normalizedName.replace(/\s+/g, "_")] = item.char
    result[normalizedName.replace(/\s+/g, "-")] = item.char

    return result
}, {})

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
