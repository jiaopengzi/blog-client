<!--
 * FilePath    : blog-client-nuxt\src\components\common\head-tag\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 生成网站头部信息 (Nuxt 适配: unhead 由 Nuxt 接管, Head 组件改为 useHead 实现)
-->

<template>
    <!-- Nuxt 适配: 不渲染 DOM, head 内容经 useHead 写入 -->
</template>

<script lang="ts" setup>
import { type HeadProps } from "./types"

defineOptions({ name: "HeadTag" })

const {
    headData = {
        title: "home",
        type: "article",
        locale: "zh-CN",
        author: "焦棚子",
        url: "https://jiaopengzi.com/",
    },
} = defineProps<{
    headData?: HeadProps
}>()

// Nuxt 适配: 对应原 <Head> 子节点 (title/meta), 改为 useHead 响应式写入
useHead(() => {
    const d = headData
    type HeadMeta = { name: string; content: string } | { property: string; content: string }
    const meta: (HeadMeta | null)[] = [
        d.description ? { name: "description", content: d.description } : null,
        d.keywords ? { name: "keywords", content: d.keywords } : null,
        d.type ? { property: "og:type", content: d.type } : null,
        d.locale ? { property: "og:locale", content: d.locale } : null,
        d.title ? { property: "og:title", content: d.title } : null,
        d.author ? { property: "og:author", content: d.author } : null,
        d.image ? { property: "og:image", content: d.image } : null,
        d.siteName ? { property: "og:site_name", content: d.siteName } : null,
        d.description ? { property: "og:description", content: d.description } : null,
        d.url ? { property: "og:url", content: d.url } : null,
        d.releaseDate ? { property: "og:release_date", content: d.releaseDate } : null,
    ]

    return {
        title: d.title,
        meta: meta.filter((m): m is HeadMeta => m !== null),
    }
})
</script>
