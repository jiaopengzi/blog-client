<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-08-04 10:54:19
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-08-12 11:50:13
 * @FilePath     : \blog-client\src\App.vue
 * @Description  : 入口文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->


<template>
  <div class="app">
    <!-- :key="$route.fullPath" 解决url变化而页面不刷新问题 -->
    <router-view :key="$route.fullPath" />
  </div>
</template>
<script setup lang="ts">

</script>
