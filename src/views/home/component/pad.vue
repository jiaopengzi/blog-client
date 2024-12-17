<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-12-17 14:56:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-17 18:45:41
 * @FilePath     : \blog-client\src\views\home\component\pad.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:26:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-17 10:12:13
 * @FilePath     : \blog-client\src\views\home\component\pc.vue
 * @Description  : pc 内容页
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
                    <PostList />
                </el-main>

                <el-aside ref="asideRef" class="el-aside">
                    <!-- 推荐阅读 -->
                    <RecommendedRead class="el-aside-item" />
                    <!-- 热门文章 -->
                    <HotPost class="el-aside-item" />
                    <!-- 月度归档 -->
                    <MonthArchive class="el-aside-item" />
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
import { useTemplateRef } from "vue"
import { useResizeObserver } from "@vueuse/core"
import router from "@/router"
import { ArrowRight, Location } from "@element-plus/icons-vue"
import { routeObj } from "@/router/routeAll"
import { type PostTag as PostTagType } from "@/api/postTag/view"

import Carousel from "@/views/home/component/carousel"
import PostList from "@/views/home/component/post-list"
import RecommendedRead from "@/components/layout/aside/recommended-read"
import HotPost from "@/components/layout/aside/hot-post"
import MonthArchive from "@/components/layout/aside/month-archive"
import PostTag from "@/components/layout/aside/post-tag"
import type { ElAside } from "element-plus"

defineOptions({ name: "HomePC" })

const asideRef = useTemplateRef<InstanceType<typeof ElAside>>("asideRef")

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
            const htmlChild = child as HTMLElement // 断言为 HTMLElement 类型
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
.content {
    width: pc.$width-page-main;
    display: flex;
    flex-direction: column;
    background-color: var(--jpz-bg-color-page);
}

.breadcrumb {
    width: pc.$width-page-main;
    height: 40px;
    border: 0;
    margin: 0;
    margin-top: pc.$height-header;
    padding: 0;
    vertical-align: baseline;
    display: flex;
    align-items: center;
}

.breadcrumb-item {
    margin-right: 5px;
    color: var(--jpz-text-color-secondary);
}

.breadcrumb-logo {
    color: var(--jpz-color-secondary);
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

.pagination-block {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
