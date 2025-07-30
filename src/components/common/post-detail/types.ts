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
    detailType?: PostDetailType // 页面类型
    headingShowCurrentIndex: number // 当前展示的标题的索引
    time: Date | null
    isShowDetailInteraction?: boolean // 是否显示详情交互
    isShowDetailBottomSame?: boolean // 是否显示详情底部相同内容
    isShowDetailCategoryTag?: boolean // 是否显示详情分类标签
    isShowDetailCopyright?: boolean // 是否显示详情版权信息
    isShowDetailPrevNext?: boolean // 是否显示详情上一篇下一篇
}
