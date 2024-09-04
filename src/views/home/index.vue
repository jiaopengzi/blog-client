<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-25 12:34:37
 * @FilePath     : \blog-client\src\views\home\index.vue
 * @Description  : 首页
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="page">
    <LayoutHeader />
    <LayoutHome />
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// import LayoutHeader from '@/components/layout/header'
// import LayoutHome from '@/views/home/component'
// import LayoutFooter from '@/components/layout/footer'
const LayoutHeader = defineAsyncComponent(() => import('@/components/layout/header'))
const LayoutHome = defineAsyncComponent(() => import('@/views/home/component'))
const LayoutFooter = defineAsyncComponent(() => import('@/components/layout/footer'))

defineOptions({ name: 'PageHome' })
</script>

<style scoped lang="scss"></style>
