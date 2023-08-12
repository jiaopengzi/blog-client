<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-12 18:35:22
 * @FilePath     : \blog-client\src\views\HomeView.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->



<template>
  <div class="page">
    <headerComponent />
    <contentComponent />
    <footerComponent />
  </div>
</template>

<script setup lang="ts">
import { headerComponent, footerComponent, contentComponent } from '@/components/common/index.ts'
</script>

<style scoped lang="less">
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
