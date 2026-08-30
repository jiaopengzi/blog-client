<!--
 * FilePath    : blog-client-nuxt\src\pages\category\[slug].vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 分类列表页 (阶段 3: 完整公开页 UI)
-->

<!--
 * 补充说明:
 * SSR 直出布局骨架; 客户端由 main-content 将 route.params.slug 注入
 * 请求参数 (计划 3.3, 不复用旧 query 机制), 数据流与 SPA 一致
-->

<script setup lang="ts">
import PostListView from "@/components/layout/post-list-view"
import { useSiteOptions } from "@/composables/useSiteOptions"
import { useTaxonomySeo } from "@/composables/useSeo"

definePageMeta({ name: "category" })

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ""))

// 站点配置 SSR 预填充 (optionsStore 服务端取数并入 payload,
// 客户端 hydration 直接复用, 保证页头导航/Logo/页脚双端一致、无 hydration mismatch)
await useSiteOptions()

// 阶段 5: 分类页 SEO (title 含 slug、canonical/OG、BreadcrumbList JSON-LD)
useTaxonomySeo("category", slug.value)
</script>

<template>
    <PostListView />
</template>
