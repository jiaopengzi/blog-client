<!--
 * FilePath    : blog-client\src\components\layout\page\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 页面布局组件
-->

<template>
    <div class="page">
        <LayoutHeader @handle-search="handleSearch" />
        <slot :search-data="searchData" />
        <LayoutFooter />
    </div>

    <el-backtop :bottom="100" class="backtop-container">
        <div class="backtop">UP</div>
    </el-backtop>
</template>

<script setup lang="ts">
import { ref } from "vue"

import LayoutFooter from "../footer"
import LayoutHeader from "../header"
import { type SearchData } from "../search"

defineOptions({ name: "LayoutPage" })

const searchData = ref<SearchData>({
    keyword: "",
    time: new Date(),
})

const handleSearch = (val: string) => {
    searchData.value.keyword = val
    searchData.value.time = new Date()
}
</script>

<style scoped lang="scss">
// 返回顶部容器
.backtop-container {
    // 位置参考 main.scss中的 z-index 管理
    z-index: 1000;

    .backtop {
        height: 100%;
        width: 100%;
        text-align: center;
        line-height: 40px;
        color: var(--jpz-color-primary);
    }
}
</style>
