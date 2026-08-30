<!--
 * FilePath    : blog-client-nuxt\src\pages\link-list.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 友情链接页 (真实视图接入: 等价 SPA views/link-list 页面组合)
-->

<!--
 * 补充说明:
 * SPA 页面自带 LayoutHeader (is-show-search=false) + LinkListDetail + LayoutFooter,
 * 无右侧栏, 故维持 layout:false 自行组合, 避免 default 布局注入侧栏
-->

<template>
    <div class="page">
        <LayoutHeader :is-show-search="false" />
        <LinkListDetail />
        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"

import LinkListDetail from "@/components/views/link-list/link-list-detail"
import { useSiteOptions } from "@/composables/useSiteOptions"

definePageMeta({ layout: false, name: "link-list" })

defineOptions({ name: "PageLinkList" })

// 站点配置 SSR 预填充 (页头 Logo/导航与页脚依赖; layout:false 页面需自行预取,
// 与 default 布局共享同一份 asyncData, 避免水合前后 Logo 占位/页脚缺失)
await useSiteOptions()

useHead({
    title: "友情链接",
})
</script>

<style scoped lang="scss"></style>
