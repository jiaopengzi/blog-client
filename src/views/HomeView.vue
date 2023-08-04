<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-07-04 18:07:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-07-13 14:55:12
 * @FilePath     : \vuestudy\src\views\HomeView.vue
 * @Description  : 
 * blog: https://jiaopengzi.com
 * Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
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
