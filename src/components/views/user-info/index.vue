<!--
 * FilePath    : blog-client\src\components\views\user-info\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用户信息页面
-->

<template>
    <div class="page">
        <!-- bugfix(260918-01 bug02): 恢复用户中心页搜索入口; 搜索组件内部直接导航 /s/:keyword,
             自组合 header 场景无需父级接线 (旧 SPA ae8e33a0 曾有意隐藏, 按新需求恢复) -->
        <LayoutHeader />
        <JBreadcrumb />
        <UserInfo />
        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import JBreadcrumb from "@/components/common/breadcrumb"
import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"
import { RouteNames } from "@/router"
import { useBreadcrumbStore } from "@/stores/breadcrumb"
import UserInfo from "@/components/views/user-info/component"

defineOptions({ name: "PageUserInfo" })

useHead({
    title: "用户信息",
})

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.updateItems("用户信息", `/${RouteNames.UserInfo}`)
</script>

<style scoped lang="scss"></style>
