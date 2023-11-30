/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-06 23:36:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-29 12:34:11
 * @FilePath     : \blog-client\src\pkg\marked\new-marked.ts
 * @Description  : 重新封装 marked
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight' // 代码高亮
import optionsHighlight from '@/pkg/marked/highlight' // 代码高亮配置
import markedKatex from 'marked-katex-extension' // 数学公式
import optionsKatex from '@/pkg/marked/katex' // 数学公式配置
import markedExtendedTables from 'marked-extended-tables' // 表格扩展
import markedFootnote from 'marked-footnote' // 脚注
import optionFootnote from '@/pkg/marked/footnote' // 脚注配置
import { markedEmoji } from 'marked-emoji' // 表情
import emojisOptions from '@/pkg/marked/emoji' // 自定义表情
import customHeadingId from 'marked-custom-heading-id' // 自定义标题id
import { mangle } from 'marked-mangle' // 将邮件链接用HTML字符引用混淆
import { markedXhtml } from 'marked-xhtml' // 将HTML标签转换为XHTML Add closing slash to tags like: hr, br, img, and input
import { markExtensionInline } from '@/pkg/marked/mark-extension' // 自定义mark 扩展
import { subExtensionInline } from '@/pkg/marked/sub-extension' // 自定义sub 下标
import { supExtensionInline } from '@/pkg/marked/sup-extension' // 自定义sup 上标

const marked = new Marked()

marked.use(
  markedHighlight(optionsHighlight),
  markedKatex(optionsKatex),
  markedExtendedTables(),
  markedFootnote(optionFootnote),
  markedEmoji(emojisOptions),
  customHeadingId(),
  mangle(),
  markedXhtml(),
  { extensions: [markExtensionInline, subExtensionInline, supExtensionInline] },
)

export default marked
