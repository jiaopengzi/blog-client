<!--
 * FilePath    : blog-client\src\components\layout\search\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 搜索
-->

<template>
    <div class="search">
        <j-icon :name="IconKeys.Search" custom-class="search-icon" />
    </div>
</template>

<script setup lang="ts">
import { IconKeys } from "@/components/common/icons"
defineOptions({ name: "HeaderSearch" })
</script>

<style scoped lang="scss">
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
