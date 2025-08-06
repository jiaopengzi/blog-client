<!--
 * FilePath    : blog-client\src\views\home\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 主页
-->

<template>
    <div class="home">
        <BaseLayout />
    </div>
</template>

<script setup lang="ts">
import BaseLayout from "@/components/layout/base-layout"
import { RouteNames } from "@/router"
defineOptions({ name: RouteNames.Home })
</script>
