<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 10:46:35
 * @FilePath     : \blog-client\src\views\Index.vue
 * @Description  : 首页
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="page">
    <LayoutHeader />
    <ContentPC />
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from '@/components/layout/header'
import ContentPC from '@/components/pc/content/ContentPC.vue'
import LayoutFooter from '@/components/layout/footer'
</script>

<style scoped lang="scss">
// 在这里添加响应式样式
</style>
