<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-05 17:09:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-10-05 17:10:37
 * @FilePath     : \blog-client\src\views\UserInfoPCView.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="page">
    <headerComponent />
    <userInfoComponent />
    <footerComponent />
  </div>
</template>

<script setup lang="ts">
import { headerComponent, footerComponent, userInfoComponent } from '@/components/common/index'
</script>

<style scoped lang="less">
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
