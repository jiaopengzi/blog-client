<!--
 * FilePath    : blog-client-nuxt\src\pages\s\[keyword].vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 搜索展示页(阶段 3 补充: /s/:keyword, 纯 CSR 不 SSR)
-->

<!--
 * 补充说明:
 * 由 main-content 将 route.params.keyword 注入请求参数(key_word);
 * 老链接 /?key_word=:kw 经双通道 legacy 301 → /s/:kw;
 * 支持中文关键字(URL 转义), 请求参数名与旧 SPA 一致(key_word)
-->

<script setup lang="ts">
import PostListView from "@/components/layout/post-list-view"
import { useSearchSeo } from "@/composables/useSeo"

definePageMeta({ name: "search" })

const route = useRoute()
const keyword = computed(() => String(route.params.keyword ?? ""))

// 阶段 5 补: 搜索页 SEO(title/description/og/canonical; 纯 CSR 页面, 客户端 hydration 后写入 head)
useSearchSeo(keyword.value)
</script>

<template>
    <PostListView />
</template>
