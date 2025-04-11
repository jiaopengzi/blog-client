<!--
 * FilePath    : blog-client\src\views\post-detail\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情
-->

<template>
    <LayoutPage>
        <template #default="{ searchData }">
            <LayoutHome :search-data="searchData" />
        </template>
    </LayoutPage>
</template>

<script setup lang="ts">
import LayoutPage from "@/components/layout/page"

import LayoutHome from "./component"

defineOptions({ name: "PostDetail" })
</script>
