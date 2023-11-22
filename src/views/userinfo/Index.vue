<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-05 17:09:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-22 21:45:03
 * @FilePath     : \blog-client\src\views\userinfo\Index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="pc page">
    <HeaderPC />
    <IndexUserInfoPC />
    <FooterPC />
  </div>
  <div class="phone page">
    <HeaderPhone />
    <IndexUserInfoPC />
    <FooterPhone />
  </div>
</template>

<script setup lang="ts">
import HeaderPC from '@/components/common/pc/HeaderPC.vue';
import IndexUserInfoPC from '@/components/common/pc/userinfo/IndexUserInfoPC.vue';
import FooterPC from '@/components/common/pc/FooterPC.vue';
import HeaderPhone from '@/components/common/phone/HeaderPhone.vue';
import ContentPhone from '@/components/common/phone/ContentPhone.vue';
import FooterPhone from '@/components/common/phone/FooterPhone.vue';
</script>

<style scoped lang="scss"></style>
