<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-22 21:45:36
 * @FilePath     : \blog-client\src\views\IndexHome.vue
 * @Description  : 首页
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="pc page">
    <HeaderPC />
    <ContentPC />
    <FooterPC />
  </div>
  <div class="phone page">
    <HeaderPhone />
    <ContentPhone />
    <FooterPhone />
  </div>
</template>


<script setup lang="ts">
import HeaderPC from '@/components/pc/HeaderPC.vue';
import ContentPC from '@/components/pc/content/ContentPC.vue';
import FooterPC from '@/components/pc/FooterPC.vue';
import HeaderPhone from '@/components/phone/HeaderPhone.vue';
import ContentPhone from '@/components/phone/content/ContentPhone.vue';
import FooterPhone from '@/components/phone/FooterPhone.vue';
</script>

<style scoped lang="scss">
// 在这里添加响应式样式
</style>
