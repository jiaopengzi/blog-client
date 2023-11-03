<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-30 11:20:08
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
import { headerComponent, footerComponent, contentComponent } from '@/components/common/index'
</script>

<style scoped lang="scss">
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
