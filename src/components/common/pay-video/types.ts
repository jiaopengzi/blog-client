/*
 * FilePath    : blog-client\src\components\common\pay-video\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费视频类型
 */

import { type PostVideoTocTree } from "@/api/post/common"

export interface PayVideoProps {
    postId: string // 文章ID
    toc?: PostVideoTocTree[] // 目录
}
