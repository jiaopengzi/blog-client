<!--
 * FilePath    : blog-client-nuxt\src\error.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 全局错误页 (404 / 500 及其它状态码)
-->

<!--
 * 补充说明:
 * 与站内 404 展示保持一致: 复用 views/not-found (header + 面包屑 + 主体 + footer),
 * 视觉核心在 components/common/error-hero; 404 带 10s 倒计时自动回首页,
 * 500 不自动跳转 (避免刷新循环), 仅提供手动重试
 * SSR 下错误页不走默认布局, header/footer 依赖的站点配置在此预取:
 * error.vue 挂载于 NuxtRoot 的 Suspense 内, 顶层 await 可用; 页面错误触发的
 * 404 场景布局层已预取过 site-options (asyncData 缓存命中, 不重复请求);
 * 预取失败 (如后端不可用导致的 500) 时降级为空导航渲染, 不让错误页自身再抛错
-->

<template>
    <NotFound :status-code="statusCode" />
</template>

<script setup lang="ts">
import type { NuxtError } from "#app"

import NotFound from "@/components/views/not-found"

const props = defineProps<{
    error: NuxtError
}>()

// Nuxt 4.5+ NuxtError.statusCode 已弃用, 读取新字段 status(运行时两字段同值, 旧错误对象亦兼容)
const statusCode = computed(() => Number(props.error?.status) || 500)

if (import.meta.server) {
    try {
        await useSiteOptions()
    } catch {
        // 站点配置预取失败时降级渲染 (header 导航为空), 保证错误页可用
    }
}
</script>
