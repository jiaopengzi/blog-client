/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-06 23:36:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-22 11:40:10
 * @FilePath     : \blog-client\src\pkg\marked\new-marked.ts
 * @Description  : 重新封装 marked
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import "katex/dist/contrib/mhchem.mjs"

import { Marked } from "marked"
import markedAlert from "marked-alert" // 引用不同主题的警报
import customHeadingId from "marked-custom-heading-id" // 自定义标题id
import { markedEmoji } from "marked-emoji" // 表情
import markedFootnote from "marked-footnote" // 脚注
// import marked from 'marked'
import { markedHighlight } from "marked-highlight" // 代码高亮
import markedKatex from "marked-katex-extension" // 公式
import { mangle } from "marked-mangle" // 将邮件链接用HTML字符引用混淆
import { markedXhtml } from "marked-xhtml" // 将HTML标签转换为XHTML Add closing slash to tags like: hr, br, img, and input

import optionEmojis from "@/pkg/marked/extension/emoji" // 自定义表情
import optionFootnote from "@/pkg/marked/extension/footnote" // 脚注配置
import optionHighlight from "@/pkg/marked/extension/highlight" // 代码高亮配置
import optionKatex from "@/pkg/marked/extension/katex" // 公式配置
import { markExtensionInline } from "@/pkg/marked/extension/mark" // 自定义mark 扩展
import { renderer } from "@/pkg/marked/extension/renderer" // 自定义renderer
import { subExtensionInline } from "@/pkg/marked/extension/sub" // 自定义sub 下标
import { supExtensionInline } from "@/pkg/marked/extension/sup" // 自定义sup 上标
// import markedExtendedTables from 'marked-extended-tables' // 表格扩展
import tableExtension from "@/pkg/marked/extension/table" // 解除 marked 版本依赖 表格扩展

// 创建一个工厂函数来生成新的 Marked 实例
const createMarked = () => {
    const marked = new Marked()

    marked.use(
        markedKatex(optionKatex),
        markedHighlight(optionHighlight),
        tableExtension(),
        markedFootnote(optionFootnote),
        markedEmoji(optionEmojis),
        customHeadingId(),
        mangle(),
        markedXhtml(),
        markedAlert(),
        {
            breaks: true, // 允许换行
            // useNewRenderer 将在 14 版本中默认使用,参考 https://github.com/markedjs/marked/issues/3374
            // useNewRenderer: true,
            extensions: [markExtensionInline, subExtensionInline, supExtensionInline],
            renderer: renderer,
        },
    )

    return marked
}

// 将工厂函数作为默认导出
export default createMarked
