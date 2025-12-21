<!--
 * FilePath    : blog-client\src\components\layout\main-content\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 主内容区
-->

<template>
    <div class="content">
        <!-- 面包屑 -->
        <JBreadcrumb />

        <!-- 正文内容 -->
        <el-container class="container-main">
            <el-main>
                <!-- 轮播图 -->
                <HomeCarousel v-show="isShowHomeCarousel" />

                <!-- 文章列表 -->
                <PostList
                    v-if="isShowPostList || isShowSearchList"
                    :pagination-data="pagination"
                    :is-show-loading="isShowPostListLoading"
                    :highlight-key="highlightKey"
                    :show-post-list="isShowPostList"
                    :show-search-list="isShowSearchList"
                    :post-list-summary-truncate="post_list_summary_truncate"
                    :is-hide-time-icon="device === DeviceType.PHONE"
                    :is-set-time-margin="device === DeviceType.PHONE"
                    @post-id="handlePostId"
                    @update-current-page="updateCurrentPage"
                    @update-page-size="updatePageSize"
                    @click-category="clickCategory"
                    @pagination-block-visible="paginationBlockVisibleChange"
                />

                <!-- 文章详情 -->
                <PostDetail
                    ref="postDetailRef"
                    v-if="isShowPostDetail"
                    :heading-show-current-index="state.headingShowCurrentIndex"
                    :time="clickTocTime"
                    @state="handleState"
                    @click-category="clickCategory"
                    @click-tag="clickTag"
                    @commit-anchor-hash-index="handleAnchorHashIndex"
                />
            </el-main>
            <el-aside ref="asideRef" class="el-aside" v-show="isShowHomeAside && hasDataHomeAside">
                <!-- 导航栏 -->
                <Toc
                    v-if="isShowPostDetail && isShowToc && hasDataToc"
                    class="el-aside-item"
                    :headings="state.tocHtml"
                    :heading-show-current-index="state.headingShowCurrentIndex"
                    @heading-clicked="tocHeadingClicked"
                />

                <!-- 推荐阅读 -->
                <RecommendedRead
                    v-if="isShowRecommendedRead && hasDataRecommendedRead"
                    class="el-aside-item"
                    :post-data="recommendedPost"
                    @post-id="handlePostId"
                />

                <!-- 热门文章 -->
                <HotPost v-if="isShowHotPost && hasDataHotPost" class="el-aside-item" :post-data="hotPost" @post-id="handlePostId" />

                <!-- 文章标签 -->
                <PostTag v-if="isShowPostTag && hasDataPostTag" :items="postTags" class="el-aside-item" @click="clickTag" />

                <!-- 月度归档 -->
                <MonthArchive
                    v-if="isShowMonthArchive && hasDataMonthArchive"
                    class="el-aside-item"
                    :post-list="monthArchiveProps"
                    @post-by-month="clickMonthArchive"
                />
            </el-aside>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import type { ElAside } from "element-plus"
import { storeToRefs } from "pinia"
import { nextTick, onBeforeMount, type Reactive, reactive, ref, useTemplateRef, watch } from "vue"
import { useRoute } from "vue-router"

import { type ViewPostRequest } from "@/api/post/view"
import JBreadcrumb from "@/components/common/breadcrumb"
import MonthArchive from "@/components/common/month-archive"
import PostDetail from "@/components/common/post-detail"
import PostList from "@/components/common/post-list"
import type { EditorState } from "@/components/editor"
import Toc from "@/components/editor/components/toc"
import { useHome } from "@/components/hooks/useHome"
import HotPost from "@/components/layout/aside/hot-post"
import PostTag, { usePostTagData } from "@/components/layout/aside/post-tag"
import RecommendedRead from "@/components/layout/aside/recommended-read"
import HomeCarousel from "@/components/layout/carousel"
import { type SearchData } from "@/components/layout/search"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { useOptionsStore } from "@/stores/options"
import { useStatusStore } from "@/stores/status"

import { usePostDetail } from "./hooks"
import { type MainContentProps } from "./types"

defineOptions({ name: "MainContent" })

const route = useRoute()

const { searchData } = defineProps<MainContentProps>()

const asideRef = useTemplateRef<InstanceType<typeof ElAside>>("asideRef")

const deviceStore = useDeviceStore()
const optionsStore = useOptionsStore()
const statusStore = useStatusStore()

const { post_list_summary_truncate } = storeToRefs(optionsStore)
const { device } = storeToRefs(deviceStore)

const {
    isShowSearchList,
    isShowPostDetail,
    isShowPostList,
    isShowHomeCarousel,

    isShowHomeAside,
    isShowToc,
    isShowRecommendedRead,
    isShowHotPost,
    isShowPostTag,
    isShowMonthArchive,

    hasDataHomeAside,
    hasDataToc,
    hasDataRecommendedRead,
    hasDataHotPost,
    hasDataPostTag,
    hasDataMonthArchive,
} = storeToRefs(statusStore)

// 获取首页数据
const mainReq = reactive<ViewPostRequest>({} as ViewPostRequest)

const {
    pagination,
    updateRouterPush,
    updateCurrentPage,
    updatePageSize,
    updateByRoute,
    getHostPost,
    getRecommendedPost,
    getPostCountByMonth,
    recommendedPost,
    hotPost,
    monthArchiveProps,
    clickCategory,
    clickTag,
    clickMonthArchive,
    paginationBlockVisibleChange,
    isShowPostListLoading,
    clearParamsExcept,
    highlightKey,
} = useHome(mainReq)

// 获取文章标签数据
const { items: postTags, getTagTopN } = usePostTagData(false)

// 文章详情
const state: Reactive<EditorState> = reactive({
    tocHtml: [{}], // 当前高亮的目录索引
    headingShowCurrentIndex: 0, // 当前高亮的目录索引
} as EditorState)

// 更新文章详情状态
const handleState = (val: EditorState) => {
    state.tocHtml = val.tocHtml
    state.headingShowCurrentIndex = val.headingShowCurrentIndex

    // 设置是否有目录数据
    statusStore.setHasDataToc(state.tocHtml.length > 0)
}

const clickTocTime = ref(new Date())

// 更新当前的标题索引
const updateHeadingShowCurrentIndex = (index: number) => {
    state.headingShowCurrentIndex = index // 设置当前目录索引
    clickTocTime.value = new Date() // 保证相同关键字搜索时, 重新渲染
}

/**
 * @description: 目录导航点击事件
 * @param index 点击的目录索引
 */
const tocHeadingClicked = (index: number) => {
    statusStore.setAnchorHash(`#${state.tocHtml[index]!.anchor}`) // 设置锚点
    updateHeadingShowCurrentIndex(index)
}

// 处理标题锚点
const handleAnchorHashIndex = async (index: number) => {
    await nextTick(() => {
        updateHeadingShowCurrentIndex(index)
    })
}

// 监听搜索关键字变化，更新路由
watch(
    () => searchData,
    async (val: SearchData) => {
        // 关键字为空时，直接返回
        if (val.keyword === "" || val.keyword.trim() === "") {
            statusStore.setHome() // 文章列表状态
            return
        }

        // 处理搜索关键字
        mainReq.key_word = val.keyword.trim()
        statusStore.setSearch() // 搜索状态

        // 去除掉参数中的 highlight_fields, pre_tags, post_tags,后续会根据 useHome自动加上, 避免在url中出现
        clearParamsExcept(["key_word"])
        await updateRouterPush()
    },
    { deep: true },
)

// 监听路由更新文章列表
watch(
    () => route.fullPath,
    async (newVal, oldVal) => {
        // **注意是非详情页**
        if (!newVal || newVal === oldVal || isShowPostDetail.value) return
        await statusStore.setAnchorHash("") // 清空锚点
        await updateByRoute()
    },
)

// 点击文章
const { handlePostId } = usePostDetail()

onBeforeMount(async () => {
    if (!isShowPostDetail.value) {
        await updateByRoute()
    }
    if (isShowRecommendedRead.value) {
        await getRecommendedPost()
    }
    if (isShowHotPost.value) {
        await getHostPost()
    }
    if (isShowMonthArchive.value) {
        await getPostCountByMonth()
    }
    if (isShowPostTag.value) {
        await getTagTopN()
    }
})
</script>
<style scoped lang="scss">
:deep(.highlight-title) {
    color: var(--jpz-color-secondary);
    font-weight: 600;
}

.content {
    display: flex;
    flex-direction: column;
    background-color: var(--jpz-bg-color-page);
}

@include respond-to("pc") {
    .content {
        width: pc.$width-page-main;
    }

    .container-main {
        // 确保子元素可以自行决定高度, 配合 el-aside 的 sticky 定位
        display: flex;
        align-items: flex-start;
    }

    .el-main {
        // background-color: var(--jpz-bg-color);
        padding-left: 0px;
        padding-top: 0px;
    }

    .el-aside {
        position: sticky; // 使侧边栏固定在页面顶部, 粘性定位
        top: 0;
        width: pc.$width-aside;
        background-color: var(--jpz-bg-color-page);
    }

    .el-aside-item {
        margin-bottom: 10px;
    }
}

@include respond-to("pad") {
    .content {
        width: pad.$width-page;
    }

    .el-main {
        padding-left: 0;
        padding-top: 0;
        padding-right: 0;
        padding-bottom: 10px;
    }

    .el-aside {
        display: none;
    }
}

@include respond-to("phone") {
    .content {
        width: 100vw;
    }

    .el-main {
        padding-left: 0;
        padding-top: 0;
        padding-right: 0;
        padding-bottom: 10px;
    }

    .el-aside {
        display: none;
    }
}
</style>
