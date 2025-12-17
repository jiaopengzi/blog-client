/*
 * FilePath    : blog-client\src\components\editor\components\codemirror\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { Completion } from "@codemirror/autocomplete"

import { type CreateSetupType } from "@/pkg/codemirror"

import type { CommandsKey, MarkdownEditorCommandItem } from "../../command"

export interface CodemirrorRef extends HTMLElement {
    root: HTMLElement
    insertContent: (content: string) => void
}

// codemirror 编辑器命令
export interface CmCommand {
    commandName: CommandsKey
    customContent?: MarkdownEditorCommandItem
    time: Date | null
}

// markdown 标题行号类型
export interface MarkdownHeadingLine {
    index: number // markdown 标题索引
    markdownHeading: string // markdown 标题
    markdownLineNumber: number // markdown行号
}

export interface CodeEditorProps {
    doc: string // 编辑器内容

    cmCommand?: CmCommand // 命令
    vimMode?: boolean // 是否开启 vim 模式
    initDocIsEmpty?: boolean // 初始内容是否为空, 默认为 true 即默认为空
    width?: string // 宽度
    height?: string // 高度
    mentions?: Completion[] // @ 提及补全
    isWatchMouse?: boolean // 是否监听鼠标事件

    headingShowCurrentIndex?: number // 当前展示的标题的索引
    tocMarkdown?: MarkdownHeadingLine[] // markdown 目录内容
    isUserScrollCmEditor?: boolean // 是否用户滚动编辑器
    createSetup?: CreateSetupType // 编辑器配置项
    placeholderText?: string // 占位符文本
}
