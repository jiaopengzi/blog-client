<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-18 09:51:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-23 20:48:21
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
  <div class="video-container">
    <video ref="video" controls>
      <source src="http://10.10.2.222:8081/api/v1/uploads/test.mp4" type="video/mp4">
    </video>
    <CustomSubtitles :currentTime="currentTime" :vttUrl="vttUrl" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import CustomSubtitles from './CustomSubtitles.vue';

const videoElement = ref<HTMLVideoElement | null>(null);
const currentTime = ref(0);

const vttUrl = ref("http://10.10.2.222:8081/api/v1/uploads/cn.vtt")

onMounted(() => {
  videoElement.value = document.querySelector('video');
  videoElement.value?.addEventListener('timeupdate', () => {
    currentTime.value = videoElement.value?.currentTime || 0;
  });
});
</script>

<style scoped lang="scss">
.video-container {

  position: relative;

  video {
    width: 720px;
    height: 480px;
  }
}
</style>