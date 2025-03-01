/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-28 15:32:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-25 16:35:25
 * @FilePath     : \blog-client\src\pkg\marked\extension\emoji.ts
 * @Description  : 扩展 marked 的解析器，支持 emoji 标记
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import emojiJson from "emoji.json"
import type { EmojiObject, MarkedEmojiOptions } from "marked-emoji"

// grinning: { char: '😀' },
const emojiObj: Record<string, string | EmojiObject> = {}

// 循环遍历 emojiJson 生成 emojiObj
emojiJson.forEach((item) => {
    emojiObj[item.name] = { char: item.char }
})

const optionEmojis: MarkedEmojiOptions = {
    emojis: emojiObj,
    unicode: true,
}

export default optionEmojis

// marked.use(markedEmoji(options));
