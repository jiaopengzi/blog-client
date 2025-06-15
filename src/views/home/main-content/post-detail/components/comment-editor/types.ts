/*
 * FilePath    : blog-client\src\views\home\main-content\post-detail\component\comment-editor\type.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { Completion } from "@codemirror/autocomplete"

import { CommentPinnedCode, CommentReviewCode } from "@/api/comment/common"
import type { JEditorRef } from "@/components/editor"

export enum CommentEditorMode {
    REPLY = "reply",
    EDIT = "edit",
}

export interface CommentEditorRef extends HTMLElement {
    root: HTMLElement
    editor: JEditorRef
}

export interface CommentEditorProps {
    postId: string
    mentions?: Completion[]
    mode?: CommentEditorMode
    content?: string
    isAdmin?: boolean
    commentId?: string
    replyToId?: string
    isPinned?: CommentPinnedCode
    reviewCode?: CommentReviewCode
}
