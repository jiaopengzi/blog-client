/*
 * FilePath    : blog-client\src\views\home\main-content\post-detail\components\comment-list\comment-item\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { CommentRes } from "@/api/comment/common"
import { CommentStatusCode } from "@/api/post/common"

export interface CommentItemProps {
    data: CommentRes
    status: CommentStatusCode
}
