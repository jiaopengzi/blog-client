/*
 * FilePath    : blog-client\src\components\editor\command\keys.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 各平台工具栏按钮常量
 */

import { CommandsKey } from "./constant"

// pc端文章编辑器工具栏按钮
const postPc = [
    CommandsKey.Vim,
    CommandsKey.Undo,
    CommandsKey.Redo,
    CommandsKey.Clear,
    CommandsKey.H1,
    CommandsKey.H2,
    CommandsKey.H3,
    CommandsKey.Bold,
    CommandsKey.Italic,
    CommandsKey.Quote,
    CommandsKey.CodeBlock,
    CommandsKey.Link,
    CommandsKey.Ol,
    CommandsKey.Ul,
    CommandsKey.TaskList,
    CommandsKey.Mark,
    CommandsKey.Emoji,
    CommandsKey.Strikethrough,
    CommandsKey.Image,
    CommandsKey.Table,
    CommandsKey.Hr,
    CommandsKey.MathBlock,
    CommandsKey.Footnote,
    CommandsKey.Superscript,
    CommandsKey.Subscript,
    CommandsKey.Details,
    CommandsKey.Alert,
    CommandsKey.PayContent,
    // CommandsKey.Video,
    CommandsKey.Toc,
    CommandsKey.Edit,
    CommandsKey.Scroll,
    CommandsKey.Preview,
    CommandsKey.Fullscreen,
    CommandsKey.WechatOfficialAccount,
    CommandsKey.Copy,
    // CommandsKey.Markdown,
    // CommandsKey.Html,
    // CommandsKey.Pdf,
    CommandsKey.Help,
    // CommandsKey.Info,
]

// pad端文章编辑器工具栏按钮
const postPad = [
    CommandsKey.Undo,
    CommandsKey.Redo,
    CommandsKey.Clear,
    CommandsKey.Heading,
    CommandsKey.Bold,
    CommandsKey.Italic,
    CommandsKey.Quote,
    CommandsKey.CodeBlock,
    CommandsKey.Link,
    CommandsKey.Ol,
    CommandsKey.Ul,
    CommandsKey.TaskList,
    CommandsKey.Mark,
    CommandsKey.Emoji,
    CommandsKey.Strikethrough,
    CommandsKey.Hr,
    CommandsKey.MathBlock,
    CommandsKey.Footnote,
    CommandsKey.Superscript,
    CommandsKey.Subscript,
    CommandsKey.Details,
    CommandsKey.Alert,
    CommandsKey.Toc,
    CommandsKey.Edit,
    CommandsKey.Preview,
    CommandsKey.Fullscreen,
    CommandsKey.Help,
    // CommandsKey.Info,
]

// 手机端文章编辑器工具栏按钮
const postPhone = [
    CommandsKey.Undo,
    CommandsKey.Redo,
    CommandsKey.Clear,
    CommandsKey.Heading,
    CommandsKey.Bold,
    CommandsKey.Ol,
    CommandsKey.Ul,
    CommandsKey.TaskList,
    CommandsKey.Mark,
    CommandsKey.Emoji,
    CommandsKey.Edit,
    CommandsKey.Preview,
    CommandsKey.Fullscreen,
    CommandsKey.Help,
    // CommandsKey.Info,
]

// pc端评论区工具栏按钮
const commentPc = [
    CommandsKey.Clear,
    CommandsKey.Heading,
    CommandsKey.Bold,
    CommandsKey.Italic,
    CommandsKey.Quote,
    CommandsKey.CodeBlock,
    CommandsKey.Link,
    CommandsKey.Ol,
    CommandsKey.Ul,
    CommandsKey.TaskList,
    CommandsKey.Mark,
    CommandsKey.Emoji,
    CommandsKey.Fullscreen,
    CommandsKey.Edit,
    CommandsKey.Preview,
    CommandsKey.Help,
    // CommandsKey.Info,
]

// pad端评论区工具栏按钮
const commentPad = [
    CommandsKey.Clear,
    CommandsKey.Heading,
    CommandsKey.Bold,
    CommandsKey.Ol,
    CommandsKey.Ul,
    CommandsKey.TaskList,
    CommandsKey.Mark,
    CommandsKey.Emoji,
    CommandsKey.Edit,
    CommandsKey.Preview,
    CommandsKey.Fullscreen,
    CommandsKey.Help,
    // CommandsKey.Info,
]

// 手机端评论区工具栏按钮
const commentPhone = [
    CommandsKey.Clear,
    CommandsKey.Heading,
    CommandsKey.Bold,
    CommandsKey.Ol,
    CommandsKey.Ul,
    CommandsKey.Mark,
    CommandsKey.Emoji,
    CommandsKey.Edit,
    CommandsKey.Preview,
    CommandsKey.Fullscreen,
    CommandsKey.Help,
    // CommandsKey.Info,
]

// 各平台工具栏预设按钮常量
export const defaultCommandKeys = {
    postPc,
    postPad,
    postPhone,
    commentPc,
    commentPad,
    commentPhone,
}
