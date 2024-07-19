<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:43:31
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-07-19 09:35:19
 * @FilePath     : \blog-client\src\views\home\component\phone.vue
 * @Description  : pohone 内容页
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
                    <div class="pagination-block phone">
                        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                            :background="true" :size="size" layout="prev, pager, next" :total="totalPages"
                            @current-change="handleCurrentChange" />
                    </div>
                </el-main>
            </el-container>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Location } from '@element-plus/icons-vue'
import Carousel from '@/views/home/component/carousel'
import PostList from '@/views/home/component/post-list'
import { routeObj } from '@/router/routeAll'


defineOptions({ name: 'HomePhone' })
const size = ref("small")
const totalPages = ref(1000)
const currentPage = ref(5)
const pageSize = ref(10)

const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}
</script>
<style scoped lang="scss">
.content {
    // width: pc.$width-page-main;
    display: flex;
    flex-direction: column;
    width: 94vw;
}

.breadcrumb-item {
    margin-right: 5px;
}

.breadcrumb-logo {
    color: $secondary-color;
}

.el-main {
    padding-left: 0px;
    padding-top: 0px;
    padding-right: 0px;
}

.pagination-block {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>