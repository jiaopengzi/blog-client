/*
 * FilePath    : blog-client-nuxt\src\components\common\post-detail\types.ts
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

import type { PostResByID } from "@/api/post/common"

export interface PostDetailProps {
    headingShowCurrentIndex: number // 当前展示的标题的索引
    time: Date | null
    postData?: PostResByID | null // feature02: 页面 SSR 提供的文章数据(含正文), 服务端直出与水合共用
    isPasswordPost?: boolean // feature02: 页面 SSR 数据流给出的密码保护标记(响应码驱动)
}
