<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 10:34:07
 * @FilePath     : \blog-client\src\views\user-info\component\favorite\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div class="pc">
    <UserInfoFavoritePC />
  </div>
  <div class="phone">
    <UserInfoFavoritePhone />
  </div>
</template>
<script setup lang="ts">
import UserInfoFavoritePC from './pc.vue'
import UserInfoFavoritePhone from './phone.vue'

defineOptions({ name: 'UserInfoFavorite' })
</script>
<style scoped lang="scss"></style>
