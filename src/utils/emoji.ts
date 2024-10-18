/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-25 22:18:59
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-25 22:26:46
 * @FilePath     : \blog-client\src\utils\emoji.ts
 * @Description  : emojiCompletionList 单例模式
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Completion } from "@codemirror/autocomplete"
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

export default emojiCompletionList
