<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-05 17:09:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-25 12:53:10
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
    <IndexUserInfoPhone />
    <FooterPhone />
  </div>
</template>

<script setup lang="ts">
import HeaderPC from '@/components/pc/HeaderPC.vue';
import IndexUserInfoPC from '@/components/pc/userinfo/IndexUserInfoPC.vue';
import FooterPC from '@/components/pc/FooterPC.vue';
import HeaderPhone from '@/components/phone/HeaderPhone.vue';
import IndexUserInfoPhone from '@/components/phone/userinfo/IndexUserInfoPhone.vue';
import FooterPhone from '@/components/phone/FooterPhone.vue';
</script>

<style scoped lang="scss"></style>
