/*
 * FilePath    : blog-client\src\components\common\pay-content\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 付费内容类型
 */

import { type PostVideoTocTree } from "@/api/post/common"

export enum ContentPayType {
    Read = "read", // 付费阅读
    Download = "download", // 付费下载
    Video = "video", // 付费视频
}

export interface PayContentProps {
    postId?: string // 文章ID
    videoToc?: PostVideoTocTree[] // 付费视频目录
    contentPayType?: ContentPayType // 内容费类型
    isPaid?: boolean // 是否付费阅读
    price?: string // 价格(单位：分)
    loading?: boolean // 加载状态
    markdown: string
}
