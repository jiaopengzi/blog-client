<!--
 * FilePath    : blog-client-nuxt\src\pages\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 首页 (阶段 3: 完整公开页 UI —— 复用 BaseLayout 与客户端数据流)
-->

<!--
 * 补充说明:
 * SSR 直出完整布局骨架; 列表/侧栏数据由客户端 hooks 拉取 (与 SPA 数据流一致)
 * 路由名与 SPA RouteNames.Home ("home") 对齐
-->

<script setup lang="ts">
import { onMounted } from "vue"

import PostListView from "@/components/layout/post-list-view"
import { useHomeSeo } from "@/composables/useSeo"
import { useSiteOptions } from "@/composables/useSiteOptions"
import { consoleInfoFormat } from "@/version"

definePageMeta({ name: "home" })

// 站点配置 SSR 预填充 (optionsStore 服务端取数并入 payload,
// 客户端 hydration 直接复用, 保证页头导航/Logo/页脚双端一致、无 hydration mismatch)
await useSiteOptions()

// 阶段 5: 首页 SEO (title=custom_home_title+separator+custom_home_subtitle, canonical/OG 直出)
useHomeSeo()

// 打开首页时在控制台输出项目版本信息 (对齐 SPA main.ts 的 consoleInfoFormat; onMounted 仅客户端执行)
onMounted(() => {
    consoleInfoFormat()
})

// 客户端: 设置首页状态 (复刻 SPA homeMiddleware 的无参分支)
if (import.meta.client) {
    const [{ useStatusStore }, { useOptionsStore }] = await Promise.all([import("@/stores/status"), import("@/stores/options")])
    await useStatusStore().setHome()
    await useOptionsStore().initHead()
}
</script>

<template>
    <PostListView />
</template>
