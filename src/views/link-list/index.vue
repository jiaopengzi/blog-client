<!--
 * @FilePath     : \blog-client\src\views\user-info\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 用户信息页面
-->

<template>
    <div class="page">
        <LayoutHeader />
        <LinkList />
        <LayoutFooter />
    </div>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue"

import LayoutFooter from "@/components/layout/footer"
import LayoutHeader from "@/components/layout/header"

import LinkList from "./main-content"
defineOptions({ name: "PageLinkList" })

useHead({
    title: "友情链接",
})
</script>

<style scoped lang="scss"></style>
