<!--
 * FilePath    : blog-client\src\views\page\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义页面
-->

<template>
    <div class="page">
        <BaseLayout
            :detail-type="PostDetailType.Page"
            :is-show-home-aside="false"
            :is-show-home-carousel="false"
            :is-show-post-list="false"
            :is-show-recommended-read="false"
            :is-show-hot-post="false"
            :is-show-month-archive="false"
            :is-show-post-tag="false"
            :is-show-post-detail="true"
            :is-show-detail-interaction="false"
            :is-show-detail-bottom-same="false"
            :is-show-detail-category-tag="false"
            :is-show-detail-copyright="false"
            :is-show-detail-prev-next="false"
        />
    </div>
</template>

<script setup lang="ts">
import { PostDetailType } from "@/components/common/post-detail"
import BaseLayout from "@/components/layout/base-layout"
import { RouteNames } from "@/router"

defineOptions({ name: RouteNames.Page })
</script>
