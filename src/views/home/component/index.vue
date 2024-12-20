<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:26:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-20 11:45:29
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
                <el-breadcrumb-item>
                    <span class="breadcrumb-item">当前位置</span>
                </el-breadcrumb-item>
                <el-breadcrumb-item :to="routeObj.login.path">
                    <span class="breadcrumb-item">首页</span></el-breadcrumb-item
                >
            </el-breadcrumb>
        </div>

        <!-- 正文内容 -->
        <div class="common-layout">
            <el-container>
                <el-main>
                    <!-- 轮播图 -->
                    <Carousel />
                    <!-- 文章列表 -->
                    <PostList
                        :pagination="pagination"
                        @update-current-page="updateCurrentPage"
                        @update-page-size="updatePageSize"
                    />
                </el-main>

                <el-aside ref="asideRef" class="el-aside pc">
                    <!-- 推荐阅读 -->
                    <RecommendedRead class="el-aside-item" :post-data="recommendedPost" />
                    <!-- 热门文章 -->
                    <HotPost class="el-aside-item" :post-data="hotPost" />
                    <!-- 月度归档 -->
                    <MonthArchive class="el-aside-item" :post-list="monthArchiveProps" />
                    <!-- 文章标签 -->
                    <PostTag class="el-aside-item" @click="handleClick" />
                    <!-- 观察点 -->
                    <div ref="asideEndRef"></div>
                </el-aside>
            </el-container>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, useTemplateRef } from "vue"
import { useResizeObserver } from "@vueuse/core"
import router from "@/router"
import { ArrowRight, Location } from "@element-plus/icons-vue"
import { routeObj } from "@/router/routeAll"
import { type PostTag as PostTagType } from "@/api/postTag/view"

import Carousel from "@/views/home/component/carousel"
import PostList from "@/views/home/component/post-list"
import RecommendedRead from "@/components/layout/aside/recommended-read"
import HotPost from "@/components/layout/aside/hot-post"
import MonthArchive from "@/components/common/month-archive"
import PostTag from "@/components/layout/aside/post-tag"
import type { ElAside } from "element-plus"

import type { PaginationRequest } from "@/components/common"
import { useGetHomeData } from "@/components/hooks/useGetHomeData"

defineOptions({ name: "LayoutHome" })

const asideRef = useTemplateRef<InstanceType<typeof ElAside>>("asideRef")

// 获取首页数据
const mainReq = reactive<PaginationRequest>({} as PaginationRequest)
const {
    pagination,
    updateCurrentPage,
    updatePageSize,
    hotPost,
    recommendedPost,
    monthArchiveProps,
} = useGetHomeData(mainReq)

// 点击标签
function handleClick(tagItemData: PostTagType) {
    router.push({ path: "/tag/" + tagItemData.slug })
}

// 侧边栏高度计算
const reCalculateHeight = () => {
    if (asideRef.value) {
        const height = Array.from(
            asideRef.value.$el.children as HTMLCollectionOf<HTMLElement>,
        ).reduce<number>((totalHeight, child: HTMLElement) => {
            const htmlChild = child as HTMLElement
            if (htmlChild.classList.contains("el-aside-item")) {
                const style = getComputedStyle(htmlChild)
                // 高度 = 之前的高度 + 当前元素的高度 + 当前元素的 marginTop + 当前元素的 marginBottom
                return (
                    totalHeight +
                    htmlChild.offsetHeight +
                    parseFloat(style.marginTop) +
                    parseFloat(style.marginBottom)
                )
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
useResizeObserver(asideRef, (entries) => {
    // const entry = entries[0]
    // const { x, y, left, top, width, height } = entry.contentRect
    // console.log(
    //     `尺寸变化了  x: ${x},y: ${y},left: ${left},top: ${top},width: ${width}, height: ${height}`,
    // )
    reCalculateHeight()
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
