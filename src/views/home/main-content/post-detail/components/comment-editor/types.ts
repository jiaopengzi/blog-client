/*
 * FilePath    : blog-client\src\views\home\main-content\post-detail\component\comment-editor\type.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { Completion } from "@codemirror/autocomplete"

import type { JEditorRef } from "@/components/editor"

export interface CommentEditorRef extends HTMLElement {
    root: HTMLElement
    editor: JEditorRef
}

export interface CommentEditorProps {
    postId: string
    mentions?: Completion[]
}
