<!--
 * FilePath    : blog-client\src\views\home\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 主页
-->

<template>
    <div class="page">
        <BaseLayout
            :is-show-post-detail="isShowPostDetail"
            :is-show-post-list="isShowPostList"
            :is-show-home-carousel="isShowHomeCarousel"
            :is-show-home-aside="isShowHomeAside"
            :is-show-search-list="isShowSearchList"
        />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"

import BaseLayout from "@/components/layout/base-layout"
import { RouteNames } from "@/router"
import { useStatusStore } from "@/stores/status"

const statusStore = useStatusStore()
const { isShowPostDetail, isShowPostList, isShowHomeCarousel, isShowHomeAside, isShowSearchList } = storeToRefs(statusStore)
defineOptions({ name: RouteNames.Home })
</script>
