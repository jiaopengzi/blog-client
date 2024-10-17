<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-10-17 11:39:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-17 11:40:07
 * @FilePath     : \blog-client\src\views\test\挂载到html中.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- src/App.vue -->
<template>
  <div ref="previewRef" id="preview">
    <VideoPlayer />
  </div>
</template>

<script lang="ts" setup>
import VideoPlayer from '@/components/player'
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()
playerStore.setSrc('3-c19424aa') // 设置视频hashID
</script>
