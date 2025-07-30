/*
 * FilePath    : blog-client\src\components\layout\main-content\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { PostDetailType } from "@/components/common/post-detail"
import { type SearchData } from "@/components/layout/search"

export interface MainContentShow {
    isShowSearch?: boolean // 是否显示搜索框
    isShowHomeCarousel?: boolean // 是否显示首页轮播图
    isShowHomeAside?: boolean // 是否显示侧边栏
    isShowToc?: boolean // 是否显示目录
    isShowRecommendedRead?: boolean // 是否显示推荐文章
    isShowHotPost?: boolean // 是否显示热门文章
    isShowMonthArchive?: boolean // 是否显示归档
    isShowPostTag?: boolean // 是否显示标签
    isShowPostList?: boolean // 是否显示文章列表
    isShowSearchList?: boolean // 是否显示搜索结果列表
    isShowPostDetail?: boolean // 是否显示文章详情

    // 文章详情相关属性
    isShowDetailInteraction?: boolean // 是否显示详情交互
    isShowDetailBottomSame?: boolean // 是否显示详情底部相同内容
    isShowDetailCategoryTag?: boolean // 是否显示详情分类标签
    isShowDetailCopyright?: boolean // 是否显示详情版权信息
    isShowDetailPrevNext?: boolean // 是否显示详情上一篇下一篇
}

export interface MainContentProps extends MainContentShow {
    searchData: SearchData // 搜索数据
    detailType?: PostDetailType // 页面类型
}
