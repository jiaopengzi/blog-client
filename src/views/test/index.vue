<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-13 19:11:32
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>

  <VideoControls />

</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
defineOptions({ name: 'TestVue' })
const VideoControls = defineAsyncComponent(() => import('@/components/player/components/controls'))
</script>

<style scoped lang="scss"></style>
