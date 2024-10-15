<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-15 10:37:41
 * @FilePath     : \blog-client\src\views\user-info\component\post\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->


<template>
  <div class="pc">
    <UserInfoPostPC />
  </div>
  <div class="phone">
    <UserInfoPostPhone />
  </div>
</template>
<script setup lang="ts">
import UserInfoPostPC from './pc.vue'
import UserInfoPostPhone from './phone.vue'

defineOptions({ name: 'UserInfoPost' })
</script>
<style scoped lang="scss"></style>
