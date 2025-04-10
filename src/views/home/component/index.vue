<!--
 * @FilePath     : \blog-client\src\views\home\component\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 主页内容
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
                    @update-current-page="updateCurrentPage"
                    @update-page-size="updatePageSize"
                    @click-category="clickCategory"
                    @post-id="handlePostId"
                    @pagination-block-visible="paginationBlockVisibleChange"
                />
                <PostDetail v-if="showPostDetail" :post-id="postId" />
            </el-main>

            <el-aside ref="asideRef" class="el-aside pc" v-show="showHomeAside">
                <!-- 推荐阅读 -->
                <RecommendedRead class="el-aside-item" :post-data="recommendedPost" />
                <!-- 热门文章 -->
                <HotPost class="el-aside-item" :post-data="hotPost" />
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
import { onUnmounted, reactive, ref, useTemplateRef, watch } from "vue"

import { type ViewPostRequest } from "@/api/post/view"
import JBreadcrumb from "@/components/common/breadcrumb"
import MonthArchive from "@/components/common/month-archive"
import { useHome } from "@/components/hooks/useHome"
import HotPost from "@/components/layout/aside/hot-post"
import PostTag from "@/components/layout/aside/post-tag"
import RecommendedRead from "@/components/layout/aside/recommended-read"
import { useStatusStore } from "@/stores/status"

import HomeCarousel from "./carousel"
import PostDetail from "./post-detail"
import PostList from "./post-list"
import type { SearchData } from "./types"

defineOptions({ name: "LayoutHome" })

const { searchData } = defineProps<{ searchData: SearchData }>()

const asideRef = useTemplateRef<InstanceType<typeof ElAside>>("asideRef")

const statusStore = useStatusStore()
const { showPostDetail, showPostList, showHomeCarousel, showHomeAside, showSearchList } = storeToRefs(statusStore)
const highlightKey = "post_title" // 高亮的key

// 获取首页数据
const mainReq = reactive<ViewPostRequest>({} as ViewPostRequest)

// 字符串类型的key
const stringKeys: StringKeys<ViewPostRequest>[] = [
    "post_author",
    "post_category_id",
    "post_category_slug",
    "post_tag_id",
    "post_tag_slug",
    "key_word",
    "pre_tags",
    "post_tags",
]

// 字符串类型的key
const numberKeys: NumberKeys<ViewPostRequest>[] = ["year", "month", "current_page", "page_size"]

// 不需要路由的key
const noRouteKeys: (keyof ViewPostRequest)[] = ["highlight_fields", "pre_tags", "post_tags"]

const {
    pagination,
    updateRouterPush,
    updateCurrentPage,
    updatePageSize,
    hotPost,
    recommendedPost,
    monthArchiveProps,
    clickCategory,
    clickTag,
    clickMonthArchive,
    paginationBlockVisibleChange,
    isShowPostListLoading,
    clearParamsExcept,
} = useHome(mainReq, {
    stringKeys,
    numberKeys,
    noRouteKeys,
    highlight_fields: [highlightKey], // 高亮字段
    pre_tags: "<span class='highlight-title'>", // 高亮前缀
    post_tags: "</span>", // 高亮后缀
})

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

const postId = ref<string>("") // 文章id

// 点击文章
const handlePostId = (id: string) => {
    statusStore.setPostDetail() // 显示文章详情
    postId.value = id
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
</script>
<style scoped lang="scss">
:deep(.highlight-title) {
    color: var(--jpz-color-secondary);
    font-weight: 600;
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

.content {
    display: flex;
    flex-direction: column;
    background-color: var(--jpz-bg-color-page);
}

.pagination-block {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
