<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 13:43:31
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-13 15:57:10
 * @FilePath     : \blog-client\src\views\home\component\phone.vue
 * @Description  : phone 内容页
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
                </el-main>
            </el-container>
        </div>
    </div>
    <el-backtop :bottom="100">
        <div class="backtop">UP</div>
    </el-backtop>
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
}

.breadcrumb-item {
    margin-right: 5px;
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

.backtop {
    height: 100%;
    width: 100%;
    text-align: center;
    line-height: 40px;
    color: var(--jpz-color-primary);
}
</style>
