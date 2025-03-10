<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:26:17
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-03-10 11:20:55
 * @FilePath     : \blog-client\src\views\home\component\index.vue
 * @Description  : 主页内容
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="content">
        <!-- 面包屑 -->
        <div class="breadcrumb">
            <el-icon class="breadcrumb-item breadcrumb-logo">
                <Location />
            </el-icon>

            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item><span class="breadcrumb-item">当前位置</span></el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: RouteNames.Home }" @click="clickBreadcrumb"><span class="breadcrumb-item">首页</span></el-breadcrumb-item>
                <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.to" :to="item.to" @click="clickBreadcrumb">
                    <span class="breadcrumb-item">{{ item.display }}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 正文内容 -->
        <div class="common-layout">
            <el-container>
                <el-main>
                    <!-- 轮播图 -->
                    <HomeCarousel />
                    <!-- 文章列表 -->
                    <PostList
                        :pagination-data="pagination"
                        :is-show-loading="isShowPostListLoading"
                        @update-current-page="updateCurrentPage"
                        @update-page-size="updatePageSize"
                        @click-category="clickCategory"
                        @post-id="handlePostId"
                        @pagination-block-visible="paginationBlockVisibleChange"
                    />
                </el-main>

                <el-aside ref="asideRef" class="el-aside pc">
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
    </div>
</template>
<script setup lang="ts">
import { ArrowRight, Location } from "@element-plus/icons-vue"
import { useResizeObserver } from "@vueuse/core"
import type { ElAside } from "element-plus"
import { onUnmounted, reactive, useTemplateRef } from "vue"

import { type ViewPostRequest } from "@/api/post/view"
import MonthArchive from "@/components/common/month-archive"
import { useHome } from "@/components/hooks/useHome"
import HotPost from "@/components/layout/aside/hot-post"
import PostTag from "@/components/layout/aside/post-tag"
import RecommendedRead from "@/components/layout/aside/recommended-read"
import { RouteNames } from "@/router"
import HomeCarousel from "@/views/home/component/carousel"
import PostList from "@/views/home/component/post-list"

defineOptions({ name: "LayoutHome" })

const asideRef = useTemplateRef<InstanceType<typeof ElAside>>("asideRef")

// 获取首页数据
const mainReq = reactive<ViewPostRequest>({} as ViewPostRequest)

// 字符串类型的key
const stringKeys: StringKeys<ViewPostRequest>[] = ["post_author", "post_category_id", "post_tag_id", "key_word"]

// 字符串类型的key
const numberKeys: NumberKeys<ViewPostRequest>[] = ["year", "month", "current_page", "page_size"]

const {
    pagination,
    updateCurrentPage,
    updatePageSize,
    hotPost,
    recommendedPost,
    monthArchiveProps,
    clickCategory,
    clickTag,
    clickMonthArchive,
    handlePostId,
    breadcrumbItems,
    clickBreadcrumb,
    paginationBlockVisibleChange,
    isShowPostListLoading,
} = useHome(mainReq, { stringKeys, numberKeys })

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
}

@include respond-to("phone") {
    .content {
        width: 94vw;
    }
    .el-main {
        padding-left: 0px;
        padding-top: 0px;
        padding-right: 0px;
    }
}

.content {
    width: pc.$width-page-main;
    display: flex;
    flex-direction: column;
    background-color: var(--jpz-bg-color-page);
}

.breadcrumb-item {
    margin-right: 4px;
    color: var(--jpz-text-color-secondary);
    font-weight: 500;
}

.breadcrumb-logo {
    color: var(--jpz-color-secondary);
}

.pagination-block {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
