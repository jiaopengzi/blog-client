<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-16 17:59:23
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div ref=container class="container">
    <VideoWatermark :container="container" :text-watermark="textContent" :logo-watermark="logo" />
  </div>


</template>

<script setup lang="ts">

import { defineAsyncComponent, useTemplateRef } from 'vue'
defineOptions({ name: 'TestVue' })
import type { TextWatermark, LogoWatermark } from '@/stores/player'
import VideoWatermark from '@/components/player/components/watermark'

const container = useTemplateRef<HTMLElement | null>("container")

const textContent: TextWatermark = {
  content: '焦棚子',
  style: {
    color: 'red',
  }
}

const logo: LogoWatermark = {
  imgUrl: '',
  style: {
    width: '219px',
    height: '50px',
    left: '50%',
    top: '50%',
    // 透明度
    opacity: "0.2",
  }
}

</script>

<style scoped lang="scss">
.container {
  width: 500px;
  height: 500px;
  background-color: green
}
</style>