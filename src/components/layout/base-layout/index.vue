<!--
 * FilePath    : blog-client\src\components\layout\base-layout\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 基础布局组件，包含头部、页脚，内容区为插槽
-->

<template>
    <div class="page">
        <LayoutHeader :is-show-search="isShowSearch" @handle-search="handleSearch" />
        <MainContent
            :search-data="searchData"
            :is-show-home-carousel="isShowHomeCarousel"
            :is-show-home-aside="isShowHomeAside"
            :is-show-toc="isShowToc"
            :is-show-recommended-read="isShowRecommendedRead"
            :is-show-hot-post="isShowHotPost"
            :is-show-month-archive="isShowMonthArchive"
            :is-show-post-tag="isShowPostTag"
            :is-show-post-list="isShowPostList"
            :is-show-search-list="isShowSearchList"
            :is-show-post-detail="isShowPostDetail"
            :detail-type="detailType"
            :is-show-detail-interaction="isShowDetailInteraction"
            :is-show-detail-bottom-same="isShowDetailBottomSame"
            :is-show-detail-category-tag="isShowDetailCategoryTag"
            :is-show-detail-copyright="isShowDetailCopyright"
            :is-show-detail-prev-next="isShowDetailPrevNext"
        />
        <LayoutFooter />
    </div>

    <el-backtop :bottom="100" class="backtop-container">
        <div class="backtop">UP</div>
    </el-backtop>
</template>

<script setup lang="ts">
import { ref } from "vue"

import { PostDetailType } from "@/components/common/post-detail"
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { type SearchData } from "@/components/layout/search"

import MainContent from "../main-content"
import { type BaseLayoutProps } from "./types"

defineOptions({ name: "BaseLayout" })

const {
    isShowSearch = true,
    isShowHomeCarousel = true,
    isShowHomeAside = true,
    isShowToc = true,
    isShowRecommendedRead = true,
    isShowHotPost = true,
    isShowMonthArchive = true,
    isShowPostTag = true,
    isShowPostList = true,
    isShowSearchList = false,
    isShowPostDetail = false,
    detailType = PostDetailType.Post, // 默认是文章详情
    isShowDetailInteraction = true, // 是否显示详情交互
    isShowDetailBottomSame = true, // 是否显示详情底部相同内容
    isShowDetailCategoryTag = true, // 是否显示详情分类标签
    isShowDetailCopyright = true, // 是否显示详情版权信息
    isShowDetailPrevNext = true, // 是否显示详情上一篇下一篇
} = defineProps<BaseLayoutProps>()

// // 事件
// const emit = defineEmits<{
//     (event: "handle-search", val: string): void
// }>()

const searchData = ref<SearchData>({
    keyword: "",
    time: new Date(),
})

const handleSearch = (val: string) => {
    searchData.value.keyword = val
    searchData.value.time = new Date() // 保证相同关键字搜索时, 重新渲染
}
</script>

<style scoped lang="scss">
// 返回顶部容器
.backtop-container {
    // 位置参考 main.scss中的 z-index 管理
    z-index: 1000;

    .backtop {
        height: 100%;
        width: 100%;
        text-align: center;
        line-height: 40px;
        color: var(--jpz-color-primary);
    }
}
</style>
