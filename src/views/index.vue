<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 23:40:13
 * @FilePath     : \blog-client\src\views\Index.vue
 * @Description  : 首页
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="page">
    <LayoutHeader />
    <LayoutHome />
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from '@/components/layout/header'
import LayoutHome from '@/components/layout/content/home'
import LayoutFooter from '@/components/layout/footer'

defineOptions({ name: 'PageHome' })
</script>

<style scoped lang="scss"></style>
