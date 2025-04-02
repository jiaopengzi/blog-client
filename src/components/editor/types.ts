/**
 * @FilePath     : \blog-client\src\components\editor\core\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 编辑器类型
 */

import type { Heading } from "./components/toc"

// markdown 标题行号类型
export interface MarkdownHeadingLine {
    index: number // markdown 标题索引
    markdownHeading: string // markdown 标题
    markdownLineNumber: number // markdown行号
}

export interface EditorState {
    tocMarkdown: MarkdownHeadingLine[] // markdown 目录内容
    tocHtml: Heading[] // html 目录内容
    tocShow: boolean // 是否显示目录
    editor: string // 编辑器内容
    editorShow: boolean // 是否显示编辑器
    preview: string // 预览内容 html
    previewShow: boolean // 是否显示预览
    imgUrls: string[] // 图片链接数组
    isShowElImageViewer: boolean // 是否显示图片预览组件
    scrollHideViewStr: string // 滚动条隐藏的编辑器 view markdown 字符串
    isAsyncScroll: boolean // 是否异步滚动
    isFullScreen: boolean // 是否全屏
    isShowEmojiPicker: boolean // 是否显示 emoji picker
    isShowPreviewWechat: boolean // 是否显示微信预览
    isShortcutKey: boolean // 是否开启快捷键
    width: number // 编辑器宽度
    isUserScrollPreview: boolean // 用户是否滚动预览
    headingShowCurrentIndex: number // 当前显示的 h 标签 index
    vimMode: boolean // 是否开启 vim 模式
}
