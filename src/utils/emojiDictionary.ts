/**
 * FilePath    : blog-client\src\utils\emojiDictionary.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : emoji 字典构建工具, 提供短码归一化与基础映射表构建能力
 */

export interface EmojiDictionaryItem {
    codes: string
    name: string
    char: string
}

export interface EmojiDictionaryMaps {
    codeToEmojiMap: Record<string, string>
    codeToOfficialNameMap: Record<string, string>
    officialNameToEmojiMap: Record<string, string>
}

/**
 * normalizeEmojiKey 统一 emoji 短码的比较键.
 * @param value 原始短码内容.
 * @returns 归一化后的短码键; 会执行 trim, 转小写, 并压缩连续空白.
 */
export function normalizeEmojiKey(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, " ")
}

/**
 * normalizeEmojiCode 统一 Unicode 码位的比较键.
 * @param value 原始 Unicode 码位.
 * @returns 归一化后的码位键; 会转小写, 并将空格统一为连字符.
 */
export function normalizeEmojiCode(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, "-")
}

/**
 * buildEmojiDictionaryMaps 基于完整 emoji 数据构建基础索引表.
 * 同一码位或同一官方名称可能同时存在文本态与 emoji 变体, 这里优先保留长度更长的字符表示,
 * 以保证后续 GitHub alias 与官方名称都尽量落到完整 emoji 变体上.
 * @param emojiItems - 原始 emoji 条目数组.
 * @returns 供解析器与补全列表复用的三张基础映射表.
 */
export function buildEmojiDictionaryMaps(emojiItems: readonly EmojiDictionaryItem[]): EmojiDictionaryMaps {
    const codeToEmojiMap: Record<string, string> = {}
    const codeToOfficialNameMap: Record<string, string> = {}
    const officialNameToEmojiMap: Record<string, string> = {}

    emojiItems.forEach((item) => {
        const normalizedName = normalizeEmojiKey(item.name.replace(/:/g, ""))
        const normalizedCode = normalizeEmojiCode(item.codes)
        const currentEmojiByCode = codeToEmojiMap[normalizedCode]
        if (!currentEmojiByCode || currentEmojiByCode.length < item.char.length) {
            codeToEmojiMap[normalizedCode] = item.char
        }

        codeToOfficialNameMap[normalizedCode] ??= normalizedName

        const currentEmojiByName = officialNameToEmojiMap[normalizedName]
        if (!currentEmojiByName || currentEmojiByName.length < item.char.length) {
            officialNameToEmojiMap[normalizedName] = item.char
        }
    })

    return {
        codeToEmojiMap,
        codeToOfficialNameMap,
        officialNameToEmojiMap,
    }
}
