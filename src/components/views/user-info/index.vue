<!--
 * FilePath    : blog-client-nuxt\src\components\views\user-info\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 用户信息页面
-->

<template>
    <div class="page">
        <LayoutHeader :is-show-search="false" />
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
