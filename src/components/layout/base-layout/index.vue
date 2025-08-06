<!--
 * FilePath    : blog-client\src\components\layout\base-layout\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 基础布局组件，包含头部、页脚，内容区为插槽
-->

<template>
    <div class="page">
        <LayoutHeader :is-show-search="isShowSearch" @handle-search="handleSearch" />
        <MainContent :search-data="searchData" />
        <LayoutFooter />
    </div>

    <el-backtop :bottom="100" class="backtop-container">
        <div class="backtop">UP</div>
    </el-backtop>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { ref } from "vue"

import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { type SearchData } from "@/components/layout/search"
import { useStatusStore } from "@/stores/status"

import MainContent from "../main-content"

defineOptions({ name: "BaseLayout" })

const statusStore = useStatusStore()

const { isShowSearch } = storeToRefs(statusStore)

// // 事件
// const emit = defineEmits<{
//     (event: "handle-search", val: string): void
// }>()

const searchData = ref<SearchData>({
    keyword: "",
    time: new Date(),
})

const handleSearch = (val: string) => {
    searchData.value.keyword = val
    searchData.value.time = new Date() // 保证相同关键字搜索时, 重新渲染
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
