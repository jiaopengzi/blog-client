<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-04 17:40:05
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div>
    <video ref="video" controls></video>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Hls from 'hls.js';

const video = ref(null);

// onMounted(() => {
//   const hls = new Hls(
//     {
//       // HLS.js 配置选项
//       maxBufferLength: 5, // 设置最大缓冲长度为30秒
//       // maxBufferSize: 60 * 1000 * 1000, // 设置最大缓冲大小为60MB
//       maxBufferHole: 0.5, // 设置最大缓冲空洞为0.5秒
//     }
//   );
//   // const videoSrc = 'http://10.10.2.222:8081/api/v1/uploads/2024/08/18/main.m3u8'; // 替换为你的 HLS 流地址
//   const videoSrc = 'http://localhost:8081/api/v1/video/15-8e72860c'; // 替换为你的 HLS 流地址
//   // const videoSrc = 'http://10.10.2.222:8081/api/v1/video/14-91bc0928'; // 替换为你的 HLS 流地址

//   if (Hls.isSupported()) {
//     hls.loadSource(videoSrc);
//     hls.attachMedia(video.value);
//     hls.on(Hls.Events.MANIFEST_PARSED, function () {
//       video.value.play();
//     });
//   }
//   else if (video.value.canPlayType('application/vnd.apple.mpegurl')) {
//     video.value.src = videoSrc;
//     video.value.addEventListener('loadedmetadata', function () {
//       video.value.play();
//     });
//   }
// });
</script>

<style scoped lang="scss">
video {
  width: 100%;
  height: auto;
}
</style>
