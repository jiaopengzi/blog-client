<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-12 10:19:24
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-03-15 20:09:12
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 显示用户信息下拉菜单
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <div>{{ test1 }}</div>
  <div>{{ test2 }}</div>
</template>

<script lang="ts" setup>
import { routeObj } from '@/router/routeAll'

defineOptions({ name: 'TestC' })

const test1 = routeObj.admin.path
const test2 = routeObj.userInfo.path

</script>
