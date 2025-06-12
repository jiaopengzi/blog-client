<!--
 * FilePath    : blog-client\src\views\link-list\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 友情链接
-->

<template>
    <div class="page">
        <LayoutHeader :is-show-search="false" />
        <LinkListDetail />
        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue"

import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"

import LinkListDetail from "./components"

defineOptions({ name: "PageLinkList" })

useHead({
    title: "友情链接",
})
</script>

<style scoped lang="scss"></style>
