/*
 * FilePath    : blog-client\src\views\admin\component\main\comment\edit-reply\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { Completion } from "@codemirror/autocomplete"

import type { CommentResAdmin } from "@/api/comment/common"
import { CommentStatusCode } from "@/api/post/common"

export interface EditReplyProps {
    data: CommentResAdmin
    postId: string
    mentions: Completion[]
    commentStatus: CommentStatusCode
}
