<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-10-05 17:09:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-12 22:21:47
 * @FilePath     : \blog-client\src\views\userinfo\Index.vue
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
import UserInfo from '@/components/layout/content/userinfo'
import LayoutFooter from '@/components/layout/footer'

defineOptions({ name: 'PageUserInfo' })
</script>

<style scoped lang="scss"></style>
