/*
 * FilePath    : blog-client\src\components\editor\components\codemirror\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { CommandsKey, MarkdownEditorCommandItem } from "../../command"

export interface CodemirrorRef extends HTMLElement {
    root: HTMLElement
    runCommand: (commandName: CommandsKey, customContent?: MarkdownEditorCommandItem) => void
    insertContent: (content: string) => void
    scrollIntoViewLine: (line: number) => void
}

export interface CodeEditorProps {
    doc: string // 编辑器内容
    width?: string // 宽度
    height?: string // 高度
    vimMode?: boolean // 是否开启 vim 模式
}
