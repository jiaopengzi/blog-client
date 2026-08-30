<!--
 * FilePath    : blog-client-nuxt\src\pages\year\[year]\month\[month].vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 年月归档页(阶段 3: 完整公开页 UI)
-->

<!--
 * 补充说明:
 * SSR 直出布局骨架; 客户端由 main-content 将 route.params.year/month 注入
 * 请求参数(计划 3.3, 不复用旧 query 机制), 数据流与 SPA 一致
-->

<script setup lang="ts">
import PostListView from "@/components/layout/post-list-view"
import { useSiteOptions } from "@/composables/useSiteOptions"
import { useArchiveSeo } from "@/composables/useSeo"

definePageMeta({ name: "year-month" })

const route = useRoute()
const year = computed(() => String(route.params.year ?? ""))
const month = computed(() => String(route.params.month ?? ""))

// 站点配置 SSR 预填充(optionsStore 服务端取数并入 payload,
// 客户端 hydration 直接复用, 保证页头导航/Logo/页脚双端一致, 无 hydration mismatch)
await useSiteOptions()

// 阶段 5 补: 年月归档页完整 SEO(title/description/og/canonical/BreadcrumbList)
useArchiveSeo(year.value, month.value)
</script>

<template>
    <PostListView />
</template>
