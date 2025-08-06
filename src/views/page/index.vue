<!--
 * FilePath    : blog-client\src\views\page\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 自定义页面
-->

<template>
    <div class="page">
        <BaseLayout />
    </div>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/layout/base-layout"
import { RouteNames } from "@/router"
defineOptions({ name: RouteNames.Page })
</script>
