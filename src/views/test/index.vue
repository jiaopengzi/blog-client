<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-14 11:21:15
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <button v-permission="PermissionNames.EditMedia">编辑</button>
</template>

<script lang="ts" setup>
import { PermissionNames } from '@/utils/permissionRole'
// ...
</script>

<style scoped lang="scss">
// ...</style>
