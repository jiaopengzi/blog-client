<!--
 * FilePath    : blog-client-nuxt\src\pages\not-found.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 404 页 (站内布局版, 由原 SPA /t404 路由迁移而来)
-->

<!--
 * 补充说明:
 * P1-8 (nuxt4-good): 站壳 (header/面包屑/footer) 由命名布局 bare-shell 承接,
 * 本页只负责 404 语义内容 (面包屑项 + ErrorHero); 视觉与全局错误页一致,
 * 全壳视图 (含站壳的 views/not-found) 保留给 error.vue 与 admin 兜底复用
 * 路由名显式取 "not-found-page": 兜底页 [...slug].vue 已占用 "not-found"
-->

<script setup lang="ts">
definePageMeta({
    layout: "bare-shell",
    name: "not-found-page",
    // 面包屑由中间件 not-found-breadcrumb 在渲染前就位(布局子树先于页面 setup 渲染,
    // 在 setup 内设置会导致 SSR HTML 缺该项 → hydration mismatch)
    middleware: "not-found-breadcrumb",
})

import { useRouter } from "vue-router"

import ErrorHero from "@/components/common/error-hero"
import { RouteNames } from "@/router"

useHead({
    title: "页面不存在 | 焦棚子",
})

const router = useRouter()

// 返回首页 (倒计时归零或用户点击均走此处)
const goHome = () => {
    router.push({ name: RouteNames.Home })
}
</script>

<template>
    <div class="not-found-shell">
        <ErrorHero :status-code="404" auto-home @home="goHome" />
    </div>
</template>

<style scoped lang="scss">
.not-found-shell {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 0 72px;
}

@include respond-to("phone") {
    .not-found-shell {
        min-height: 64vh;
        padding: 24px 0 56px;
    }
}
</style>
