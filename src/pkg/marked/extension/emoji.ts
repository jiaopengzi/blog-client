/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-28 15:32:40
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-03-09 23:55:24
 * @FilePath     : \blog-client\src\pkg\marked\extension\emoji.ts
 * @Description  : 扩展 marked 的解析器，支持 emoji 标记
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import emojiJson from "emoji.json"
import type { MarkedEmojiOptions } from "marked-emoji"

// grinning: { char: '😀' },
const emojiObj: Record<string, string> = {}

// 循环遍历 emojiJson 生成 emojiObj
emojiJson.forEach((item) => {
    emojiObj[item.name] = item.char
})

const optionEmojis: MarkedEmojiOptions<Record<string, { char: string }>> = {
    emojis: emojiObj,
}

export default optionEmojis

// marked.use(markedEmoji(options));
