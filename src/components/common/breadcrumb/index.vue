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
            <el-breadcrumb-item><span class="breadcrumb-start">当前位置</span></el-breadcrumb-item>
            <el-breadcrumb-item @click="clickBreadcrumbHome"><span class="breadcrumb-home">首页</span></el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in items" :key="item.to" @click="index === items.length - 1 ? null : clickBreadcrumb(item)">
                <span :class="index === items.length - 1 ? 'breadcrumb-last' : 'breadcrumb-item'">
                    {{ item.display }}
                </span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script setup lang="ts">
import { ArrowRight, Location } from "@element-plus/icons-vue"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"

import { RouteNames } from "@/router"
import { type BreadcrumbItem, useBreadcrumbStore } from "@/stores/breadcrumb"
import { useStatusStore } from "@/stores/status"

defineOptions({ name: "JBreadcrumb" })
const router = useRouter()

const breadcrumbStore = useBreadcrumbStore()
const { items } = storeToRefs(breadcrumbStore)
const statusStore = useStatusStore()

// 点击面包屑
const clickBreadcrumbHome = () => {
    statusStore.setHome()
    breadcrumbStore.click({ display: "首页", to: RouteNames.Home })
    router.push({ name: RouteNames.Home })
}

// 点击面包屑
const clickBreadcrumb = (item: BreadcrumbItem) => {
    statusStore.setHome()
    breadcrumbStore.click(item)
    router.push(item.to)
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

.breadcrumb-start,
.breadcrumb-home,
.breadcrumb-item,
.breadcrumb-last {
    margin-right: 4px;
    color: var(--jpz-text-color-secondary);
    font-weight: 500;
}

.breadcrumb-home,
.breadcrumb-item {
    cursor: pointer;
}

.breadcrumb-logo {
    color: var(--jpz-color-secondary);
}
</style>
