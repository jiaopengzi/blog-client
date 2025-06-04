/*
 * FilePath    : blog-client\src\components\common\comment-post-item\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论文章信息
 */

import { type CommentPostRes } from "@/api/comment/common"

export interface PostProps {
    post: CommentPostRes // 用户信息
}
