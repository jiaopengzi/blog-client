/*
 * FilePath    : blog-client\src\components\common\post-detail\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export enum PostDetailType {
    Post = "post", // 文章
    Page = "page", // 页面
    Preview = "preview", // 预览
}

export interface PostDetailProps {
    headingShowCurrentIndex: number // 当前展示的标题的索引
    time: Date | null
}
