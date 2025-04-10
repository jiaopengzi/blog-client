/**
 * @FilePath     : \blog-client\src\components\editor\core\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 编辑器类型
 */

import { CommandsKey } from "./command"
import type { Heading } from "./components/toc"

// markdown 标题行号类型
export interface MarkdownHeadingLine {
    index: number // markdown 标题索引
    markdownHeading: string // markdown 标题
    markdownLineNumber: number // markdown行号
}

// 编辑器模式 文章模式 评论模式
export type EditorMode = "post" | "comment"

export interface EditorState {
    // toc 目录相关
    tocMarkdown: MarkdownHeadingLine[] // markdown 目录内容
    tocHtml: Heading[] // html 目录内容
    tocShow: boolean // 是否显示目录
    
    // 编辑器
    editor: string // 编辑器内容
    editorShow: boolean // 是否显示编辑器
    scrollHideViewStr: string // 滚动条隐藏的编辑器 view markdown 字符串
    isAsyncScroll: boolean // 是否异步滚动
    isFullScreen: boolean // 是否全屏
    isShowEmojiPicker: boolean // 是否显示 emoji picker
    isShortcutKey: boolean // 是否开启快捷键
    headingShowCurrentIndex: number // 当前显示的 h 标签 index
    vimMode: boolean // 是否开启 vim 模式
    commandKeys: CommandsKey[] // 工具栏按钮
    mode: EditorMode // 编辑器模式
    
    // preview 相关内容
    previewShow: boolean // 是否显示预览
    html: string // html 内容
    imgUrls: string[] // 图片地址 list
    isShowElImageViewer: boolean // 是否显示图片预览
    width: number // 宽度
    height: string // 高度
    isShowPreviewWechat: boolean // 是否显示微信预览
    isUserScrollPreview: boolean // 是否用户滚动预览
    isRemoveFirstH1: boolean // 是否移除第一个 H1 标签
}

// EditorStateOptions 编辑器状态选项
export type EditorStateOptions = Partial<EditorState>
