<!--
 * FilePath    : blog-client\src\components\common\breadcrumb\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 面包屑
-->

<template>
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
</template>
<script setup lang="ts">
import { ArrowRight, Location } from "@element-plus/icons-vue"

import { RouteNames } from "@/router"

import type { BreadcrumbItem } from "./types"

defineOptions({ name: "JBreadcrumb" })

// 数据
const { breadcrumbItems } = defineProps<{
    breadcrumbItems: BreadcrumbItem[]
}>()

// 事件
const emit = defineEmits<{
    (event: "click-breadcrumb-item", val: BreadcrumbItem): void // 更新当前页
}>()

// 点击面包屑
const clickBreadcrumb = (item: BreadcrumbItem) => {
    emit("click-breadcrumb-item", item)
}
</script>
<style scoped lang="scss">
// 导航面包屑
.breadcrumb {
    color: var(--jpz-text-color-secondary);
    vertical-align: baseline;
    display: flex;
    align-items: center;
    box-sizing: border-box; // 解决 padding 溢出
}

@include respond-to("pc") {
    .breadcrumb {
        height: pc.$height-breadcrumb;
        margin-top: pc.$height-header;
        width: pc.$width-page-main;
    }
}

@include respond-to("pad") {
    .breadcrumb {
        height: pad.$height-breadcrumb;
        margin-top: pad.$height-header;
        width: pad.$width-page;
        padding: 0 10px;
    }
}

@include respond-to("phone") {
    .breadcrumb {
        height: phone.$height-breadcrumb;
        margin-top: phone.$height-header;
        width: phone.$width-page;
        padding: 0 10px;
    }
}

.breadcrumb-item {
    margin-right: 4px;
    color: var(--jpz-text-color-secondary);
    font-weight: 500;
}

.breadcrumb-logo {
    color: var(--jpz-color-secondary);
}
</style>
