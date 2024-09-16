<!--
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
-->
<template>

  <VideoWatermark ref="videoWatermarkRef" :text-watermark="textContent" :logo-watermark="logo">

    <video src="http://10.10.2.222:8081/api/v1/uploads/test.mp4"></video>

  </VideoWatermark>

</template>

<script setup lang="ts">
import type { TextWatermark, LogoWatermark } from '@/stores/player'
import VideoWatermark from '@/components/player/components/watermark'


// 文字水印内容
const textContent: TextWatermark = {
  content: '焦棚子',
  style: {
    color: 'red',
    fontSize: '20px',
  }
}

// logo 水印内容
const logo: LogoWatermark = {
  imgUrl: 'https://jiaopengzi.com/wp-content/uploads/2021/10/220-50-1-YJ.png',
  style: {
    width: '219px',
    height: '50px',
    left: '100%',
    top: '8%',
    opacity: "0.2",
  }
}

</script>

<style scoped lang="scss">
video {
  width: 1000px;
  height: 600px;
}
</style>
