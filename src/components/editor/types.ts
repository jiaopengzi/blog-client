/**
 * @FilePath     : \blog-client\src\components\editor\core\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 编辑器类型
 */

import type { Completion } from "@codemirror/autocomplete"

import { CommandsKey } from "./command"
import type { CmCommand, CodemirrorRef } from "./components/codemirror"
import type { ViewCommand } from "./components/preview"
import type { Heading } from "./components/toc"

export interface JEditorRef extends HTMLElement {
    codemirror: CodemirrorRef
}

// markdown 标题行号类型
export interface MarkdownHeadingLine {
    index: number // markdown 标题索引
    markdownHeading: string // markdown 标题
    markdownLineNumber: number // markdown行号
}

// 编辑器模式 文章模式 评论模式
export type EditorMode = "post" | "comment"
export type ScrollStatus = "start" | "end" | undefined // 滚动条状态 start 开始 end 结束
export type MouseStatus = "cmEditor" | "preview" | undefined // 鼠标状态 cmEditor 编辑器 preview 预览

export interface EditorState {
    // toc 目录相关
    tocMarkdown: MarkdownHeadingLine[] // markdown 目录内容
    tocHtml: Heading[] // html 目录内容
    tocShow: boolean // 是否显示目录
    headingShowCurrentIndex: number // 当前显示的 h 标签 index
    scrollStatus: ScrollStatus // 滚动条状态 start 开始 end 结束
    cmCommand: CmCommand // 命令

    // 编辑器
    editorContent: string // 编辑器内容
    initDocIsEmpty: boolean // 初始内容是否为空, 默认为 true 即默认为空
    editorShow: boolean // 是否显示编辑器
    scrollHideViewStr: string // 滚动条隐藏的编辑器 view markdown 字符串
    isSyncScroll: boolean // 是否异步滚动
    isUserScrollCmEditor: boolean // 是否用户滚动编辑器
    isFullScreen: boolean // 是否全屏
    isShowEmojiPicker: boolean // 是否显示 emoji picker
    isShortcutKey: boolean // 是否开启快捷键
    vimMode: boolean // 是否开启 vim 模式
    mentions: Completion[] // @ 提及补全
    commandKeys: CommandsKey[] // 工具栏按钮
    mode: EditorMode // 编辑器模式
    mouseStatus: MouseStatus // 鼠标状态 cmEditor 编辑器 preview 预览

    // preview 相关内容
    previewShow: boolean // 是否显示预览
    html: string // html 内容
    imgUrls: string[] // 图片地址 list
    isShowElImageViewer: boolean // 是否显示图片预览
    width: string // 宽度
    height: string // 高度
    isShowPreviewWechat: boolean // 是否显示微信预览
    isUserScrollPreview: boolean // 是否用户滚动预览
    isRemoveFirstH1: boolean // 是否移除第一个 H1 标签
    viewCommand: ViewCommand // 命令
}

// EditorStateOptions 编辑器状态选项
export type EditorStateOptions = Partial<EditorState>
