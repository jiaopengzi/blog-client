<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-15 16:16:33
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div ref=container class="container">
    <VideoWatermark :watermark="textContent" :container="container" />
  </div>


</template>

<script setup lang="ts">

import { defineAsyncComponent, useTemplateRef } from 'vue'
defineOptions({ name: 'TestVue' })
import type { Watermark, TextWatermark, LogoWatermark, Logo } from '@/stores/player'
import { WatermarkEnum } from '@/stores/player'
import VideoWatermark from '@/components/player/components/watermark'
// const VideoWatermark = defineAsyncComponent(() => import('@/components/player/components/watermark'))

const container = useTemplateRef<HTMLElement | null>("container")

const textContent: TextWatermark = {
  type: WatermarkEnum.TEXT,
  content: '哈哈哈',
  fontSize: "14px",
  color: 'red',
  opacity: 0.5,
}

</script>

<style scoped lang="scss">
.container {
  width: 500px;
  height: 500px;
  background-color: green
}
</style>