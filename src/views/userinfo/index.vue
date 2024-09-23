<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-05 17:09:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-04 21:08:07
 * @FilePath     : \blog-client\src\views\userinfo\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="page">
    <LayoutHeader />
    <UserInfo />
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from '@/components/layout/header'
import UserInfo from '@/views/userinfo/component'
import LayoutFooter from '@/components/layout/footer'


defineOptions({ name: 'PageUserInfo' })
</script>

<style scoped lang="scss"></style>
