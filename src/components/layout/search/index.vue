<!--
 * FilePath    : blog-client\src\components\layout\search\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 搜索
-->

<template>
    <div>
        <el-button class="search-btn" type="primary" @click="searchDialogVisible = true">
            <j-icon :name="IconKeys.Search" custom-class="search-icon" />
        </el-button>

        <!-- icon选择弹窗 -->
        <SearchDialog v-if="searchDialogVisible" v-model="searchDialogVisible" @search="handleSearch" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { IconKeys } from "@/components/common/icons"

import SearchDialog from "./search-dialog"

defineOptions({ name: "HeaderSearch" })

// 事件
const emit = defineEmits<{
    (event: "handle-search", val: string): void
}>()

const handleSearch = (val: string) => {
    searchDialogVisible.value = false
    emit("handle-search", val)
}

const searchDialogVisible = ref(false)
</script>

<style scoped lang="scss">
.search-btn {
    // 透明
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: none;
    padding: none;
}
// .search {
//     @include respond-to("pc") {
//     }

//     @include respond-to("pad") {
//     }

//     @include respond-to("phone") {
//     }
// }
.search-icon {
    font-size: 20px;
    padding: 6px;
    border-radius: 8px;
    fill: var(--el-text-color-regular);
    cursor: pointer;
    transition: color 0.6s;
    &:hover {
        fill: var(--el-text-color-primary);
        background-color: var(--jpz-bg-color-page);
    }
}
</style>
