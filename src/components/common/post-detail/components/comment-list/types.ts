/*
 * FilePath    : blog-client\src\components\common\post-detail\components\comment-list\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { CommentStatusCode } from "@/api/post/common"

export interface CommentListProps {
    postId: string
    postAuthor: string
    status: CommentStatusCode
    updateTime: Date | null
    isAdmin?: boolean
}
