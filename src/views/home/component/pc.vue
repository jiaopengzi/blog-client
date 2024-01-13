<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:26:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-13 13:01:03
 * @FilePath     : \blog-client\src\views\home\component\pc.vue
 * @Description  : pc 内容页
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="content">
        <!-- 面包屑 -->
        <div class="breadcrumb">
            <span class="breadcrumb-item breadcrumb-logo">
                <el-icon>
                    <Location />
                </el-icon>
            </span>
            <span class="breadcrumb-item">
                <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item>当前位置</el-breadcrumb-item>
                    <el-breadcrumb-item :to="routeObj.login.path">首页</el-breadcrumb-item>
                </el-breadcrumb>
            </span>
        </div>

        <!-- 正文内容 -->
        <div class="common-layout">
            <el-container>
                <el-main>
                    <!-- 轮播图 -->
                    <Carousel />
                    <!-- 文章列表 -->
                    <PostList />
                    <!-- 分页 -->
                    <div class="pagination-block">
                        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :background="true"
                            layout="prev, pager, next, jumper, total" :total="totalPages"
                            @current-change="handleCurrentChange" />
                    </div>
                </el-main>

                <el-aside class="el-aside" ref="asideRef" id="aside">
                    <!-- 推荐阅读 -->
                    <RecommendedRead class="el-aside-item" />
                    <!-- 热门文章 -->
                    <HotPost class="el-aside-item" />
                    <!-- 月度归档 -->
                    <!-- @ready="recalculateHeight" 通知子组件已经渲染完毕 执行 recalculateHeight-->
                    <MonthArchive class="el-aside-item" @ready="reCalculateHeight" />
                    <PostTag class="el-aside-item" />
                </el-aside>
            </el-container>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ArrowRight, Location } from '@element-plus/icons-vue'
import Carousel from '@/views/home/component/carousel'
import PostList from '@/views/home/component/post-list'
import RecommendedRead from '@/components/layout/aside/recommended-read'
import HotPost from '@/components/layout/aside/hot-post'
import MonthArchive from '@/components/layout/aside/month-archive'
import PostTag from '@/components/layout/aside/post-tag'
import { routeObj } from '@/router/routeAll'
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'

defineOptions({ name: 'HomePC' })

const asideRef = ref<HTMLElement | null>(null)

const totalPages = ref(1000)
const currentPage = ref(5)
const pageSize = ref(10)

const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}

// 侧边栏高度计算
const reCalculateHeight = async () => {
    await nextTick() // 等待渲染完毕

    const aside = document.getElementById('aside') // 获取侧边栏元素
    if (aside) {
        const height = Array.from(aside.children).reduce<number>((totalHeight, child: Element) => {
            const htmlChild = child as HTMLElement // 断言为 HTMLElement 类型
            if (htmlChild.classList.contains('el-aside-item')) {
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

        aside.style.height = `${height}px` // 设置侧边栏高度
        aside.style.top = `-${height - window.innerHeight}px` // 设置侧边栏距离顶部的距离 = 侧边栏高度 - 视口高度
    }
}

onMounted(() => {
    reCalculateHeight()
    window.addEventListener('resize', reCalculateHeight) // 添加 resize 事件监听器
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', reCalculateHeight) // 移除 resize 事件监听器
})
</script>
<style scoped lang="scss">
.content {
    width: pc.$width-page-main;
    display: flex;
    flex-direction: column;
}

.breadcrumb {
    width: pc.$width-page-main;
    height: 40px;
    color: #333;
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
}

.breadcrumb-logo {
    color: $secondary-color;
}

.el-main {
    background-color: $background-color-page;
    padding-left: 0px;
    padding-top: 0px;
}

.el-aside {
    width: pc.$width-aside;
    background-color: $background-color-page;
    position: sticky; // 粘性定位
    top: -400px; // 侧边栏距离顶部的距离
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