<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-08-15 18:46:46
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

onMounted(() => {
  const hls = new Hls();
  const videoSrc = 'http://10.10.2.222:8081/api/v1/uploads/test-hls/output.m3u8'; // 替换为你的 HLS 流地址

  if (Hls.isSupported()) {
    hls.loadSource(videoSrc);
    hls.attachMedia(video.value);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.value.play();
    });
  }
  else if (video.value.canPlayType('application/vnd.apple.mpegurl')) {
    video.value.src = videoSrc;
    video.value.addEventListener('loadedmetadata', function () {
      video.value.play();
    });
  }
});
</script>

<style scoped lang="scss">
video {
  width: 100%;
  height: auto;
}
</style>
