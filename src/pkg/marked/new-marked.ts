/**
 * @FilePath     : \blog-client\src\pkg\marked\new-marked.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 配置 marked
 */

import "katex/dist/contrib/mhchem.mjs"

import { Marked } from "marked"
import markedAlert from "marked-alert" // 引用不同主题提醒效果
import customHeadingId from "marked-custom-heading-id" // 自定义标题id
import markedFootnote from "marked-footnote" // 脚注
import { markedHighlight } from "marked-highlight" // 代码高亮
import markedKatex from "marked-katex-extension" // 公式
import { mangle } from "marked-mangle" // 将邮件链接用HTML字符引用混淆
import { markedXhtml } from "marked-xhtml" // 将HTML标签转换为XHTML Add closing slash to tags like: hr, br, img, and input

import { emojiExtensionInline } from "./extension/emoji" // 自定义表情
import optionFootnote from "./extension/footnote" // 脚注配置
import optionHighlight from "./extension/highlight" // 代码高亮配置
import optionKatex from "./extension/katex" // 公式配置
import { markExtensionInline } from "./extension/mark" // 自定义mark 扩展
import { renderer } from "./extension/renderer" // 自定义renderer
import { subExtensionInline } from "./extension/sub" // 自定义sub 下标
import { supExtensionInline } from "./extension/sup" // 自定义sup 上标

let markedInstance: Marked | null = null

/**
 * setupMarked 创建并配置一个可复用的 Marked 实例.
 * @returns 配置完成的 Marked 实例.
 */
const setupMarked = (): Marked => {
    const marked = new Marked()

    marked.use(
        markedKatex(optionKatex),
        markedHighlight(optionHighlight),
        markedFootnote(optionFootnote),
        customHeadingId(),
        mangle(),
        markedXhtml(),
        markedAlert(),
        {
            breaks: true, // 允许换行
            // useNewRenderer 将在 14 版本中默认使用,参考 https://github.com/markedjs/marked/issues/3374
            // useNewRenderer: true,
            extensions: [emojiExtensionInline, markExtensionInline, subExtensionInline, supExtensionInline],
            renderer: renderer,
        },
    )

    return marked
}

/**
 * createMarked 返回按需初始化的共享 Marked 实例.
 * @returns 配置完成的 Marked 实例; emoji 解析使用轻量 map 查表实现, 避免移动端浏览器因超长正则初始化而卡顿.
 */
const createMarked = (): Marked => {
    markedInstance ??= setupMarked()
    return markedInstance
}

// 将工厂函数作为默认导出
export default createMarked
