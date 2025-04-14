<!--
 * FilePath    : blog-client\src\views\home\main-content\index.vue
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
                <HomeCarousel v-show="showHomeCarousel" />
                <!-- 文章列表 -->
                <PostList
                    v-if="showPostList || showSearchList"
                    :pagination-data="pagination"
                    :is-show-loading="isShowPostListLoading"
                    :highlight-key="highlightKey"
                    :show-post-list="showPostList"
                    :show-search-list="showSearchList"
                    @post-id="handlePostId"
                    @update-current-page="updateCurrentPage"
                    @update-page-size="updatePageSize"
                    @click-category="clickCategory"
                    @pagination-block-visible="paginationBlockVisibleChange"
                />
                <PostDetail ref="postDetailRef" v-if="showPostDetail" @state="handleState" />
            </el-main>

            <el-aside ref="asideRef" class="el-aside pc" v-show="showHomeAside">
                <!-- 导航栏 -->
                <EditorToc :headings="state.tocHtml" :heading-show-current-index="state.headingShowCurrentIndex" @heading-clicked="tocHeadingClicked" />
                <!-- 推荐阅读 -->
                <RecommendedRead class="el-aside-item" :post-data="recommendedPost" @post-id="handlePostId" />
                <!-- 热门文章 -->
                <HotPost class="el-aside-item" :post-data="hotPost" @post-id="handlePostId" />
                <!-- 月度归档 -->
                <MonthArchive class="el-aside-item" :post-list="monthArchiveProps" @post-by-month="clickMonthArchive" />
                <!-- 文章标签 -->
                <PostTag class="el-aside-item" @click="clickTag" />
                <!-- 观察点 -->
                <div ref="asideEndRef"></div>
            </el-aside>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { useResizeObserver } from "@vueuse/core"
import type { ElAside } from "element-plus"
import { storeToRefs } from "pinia"
import { computed, onBeforeMount, onUnmounted, type Reactive, reactive, useTemplateRef, watch } from "vue"
import { useRoute } from "vue-router"

import { type ViewPostRequest } from "@/api/post/view"
import JBreadcrumb from "@/components/common/breadcrumb"
import MonthArchive from "@/components/common/month-archive"
import type { EditorState } from "@/components/editor"
import EditorToc from "@/components/editor/components/toc"
import { type TocScroll, useToc } from "@/components/editor/hooks"
import { useHome } from "@/components/hooks/useHome"
import HotPost from "@/components/layout/aside/hot-post"
import PostTag from "@/components/layout/aside/post-tag"
import RecommendedRead from "@/components/layout/aside/recommended-read"
import HomeCarousel from "@/components/layout/carousel"
import { type SearchData } from "@/components/layout/search"
import { useStatusStore } from "@/stores/status"

import PostDetail from "./post-detail"
import PostList from "./post-list"

defineOptions({ name: "MainContent" })

const route = useRoute()
const { searchData } = defineProps<{ searchData: SearchData }>()

const asideRef = useTemplateRef<InstanceType<typeof ElAside>>("asideRef")
const postDetailRef = useTemplateRef("postDetailRef")

const statusStore = useStatusStore()
const { showPostDetail, showPostList, showHomeCarousel, showHomeAside, showSearchList } = storeToRefs(statusStore)

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
    hotPost,
    recommendedPost,
    monthArchiveProps,
    clickCategory,
    clickTag,
    clickMonthArchive,
    paginationBlockVisibleChange,
    isShowPostListLoading,
    clearParamsExcept,
    highlightKey,
} = useHome(mainReq)

// 文章详情
const state: Reactive<EditorState> = reactive({
    tocHtml: [{}], // 当前高亮的目录索引
    headingShowCurrentIndex: 0, // 当前高亮的目录索引
} as EditorState)

// 更新文章详情状态
const handleState = (val: EditorState) => {
    Object.assign(state, val)
}
// 使用 computed 包装 previewRef 保持响应性
const previewRef = computed(() => postDetailRef.value?.previewRef)

// 目录点击事件
const { tocHeadingClicked } = useToc({ state, previewRef } as TocScroll)
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
        if (!newVal || newVal === oldVal || showPostDetail.value) return
        await updateByRoute()
    },
)

// 点击文章
const handlePostId = async (val: string) => {
    await statusStore.setPostId(val)
    await statusStore.setPostDetail()

    // 滚动到顶部
    window.scrollTo({
        top: 0,
        behavior: "auto",
    })
}

// 侧边栏高度计算
const reCalculateHeight = () => {
    if (asideRef.value) {
        const height = Array.from(asideRef.value.$el.children as HTMLCollectionOf<HTMLElement>).reduce<number>((totalHeight, child: HTMLElement) => {
            const htmlChild = child as HTMLElement
            if (htmlChild.classList.contains("el-aside-item")) {
                const style = getComputedStyle(htmlChild)
                // 高度 = 之前的高度 + 当前元素的高度 + 当前元素的 marginTop + 当前元素的 marginBottom
                return totalHeight + htmlChild.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom)
            }
            return totalHeight
        }, 0)

        // 设置侧边栏高度
        asideRef.value.$el.style.height = `${height}px`

        // 设置侧边栏距离顶部的距离 = 侧边栏高度 - 视口高度
        asideRef.value.$el.style.top = `-${height - window.innerHeight}px`
    }
}

// 监控 asideRef 元素的变化 重新计算高度
const { stop } = useResizeObserver(asideRef, (entries) => {
    // const entry = entries[0]
    // const { x, y, left, top, width, height } = entry.contentRect
    // console.log(
    //     `尺寸变化了  x: ${x},y: ${y},left: ${left},top: ${top},width: ${width}, height: ${height}`,
    // )
    reCalculateHeight()
})

onUnmounted(() => {
    stop()
})

onBeforeMount(async () => {
    if (!showPostDetail.value) {
        await updateByRoute()
    }
    await getHostPost()
    await getRecommendedPost()
    await getPostCountByMonth()
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

    .el-main {
        // background-color: var(--jpz-bg-color);
        padding-left: 0px;
        padding-top: 0px;
    }

    .el-aside {
        width: pc.$width-aside;
        background-color: var(--jpz-bg-color-page);
        position: sticky; // 粘性定位 和 reCalculateHeight 配合使用
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
        padding: 0px;
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
    }
}
</style>
