<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:43:31
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-17 10:11:01
 * @FilePath     : \blog-client\src\views\home\component\phone.vue
 * @Description  : phone 内容页
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
            </el-container>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ArrowRight, Location } from "@element-plus/icons-vue"
import { routeObj } from "@/router/routeAll"

import Carousel from "@/views/home/component/carousel"
import PostList from "@/views/home/component/post-list"

defineOptions({ name: "HomePhone" })
</script>
<style scoped lang="scss">
.content {
    // width: pc.$width-page-main;
    display: flex;
    flex-direction: column;
    width: 94vw;
    background-color: var(--jpz-bg-color-page);
}

.breadcrumb-item {
    margin-right: 5px;
    color: var(--jpz-text-color-secondary);
}

.breadcrumb-logo {
    color: var(--jpz-color-secondary);
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
