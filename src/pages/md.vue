<!--
 * FilePath    : blog-client-nuxt\src\pages\md.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Markdown 编辑器 (阶段 6: 真实视图接入)
-->

<!--
 * 补充说明:
 * 渲染 SPA views/md 迁移视图 (src/components/views/md), 编辑器树/主题/草稿
 * 逻辑全量对齐 SPA; layout:false (全屏编辑页, 自带 FooterStatistics)
-->

<script setup lang="ts">
import MdView from "@/components/views/md"

// 路由名与 SPA RouteNames.Md ("md") 对齐; 全屏编辑页无默认布局
definePageMeta({ layout: false, name: "md" })
</script>

<template>
    <MdView />
</template>
