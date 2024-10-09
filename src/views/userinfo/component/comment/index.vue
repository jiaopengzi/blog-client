<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 21:24:53
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-23 19:47:21
 * @FilePath     : \blog-client\src\views\userinfo\component\comment\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="pc">
    <UserInfoCommentPC />
  </div>
  <div class="phone">
    <UserInfoCommentPhone />
  </div>
</template>
<script setup lang="ts">
import UserInfoCommentPC from './pc.vue'
import UserInfoCommentPhone from './phone.vue'

defineOptions({ name: 'UserInfoComment' })
</script>
<style scoped lang="scss"></style>
