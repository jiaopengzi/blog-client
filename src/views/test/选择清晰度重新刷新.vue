<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 19:05:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 19:05:45
 * @FilePath     : \blog-client\src\views\test\index copy 2.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="video-container">
    <video ref="video" class="custom-video" controls muted>
    </video>
    <!-- 选择框 -->
    <select v-model="p">
      <option value="1080p">1080p</option>
      <option value="720p">720p</option>
      <option value="480p">480p</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TestVue' })
import { ref, onMounted, watch } from 'vue';
import Hls from 'hls.js';
import { CustomKeyLoader } from '@/pkg/hls';

type P = '1080p' | '720p' | '480p';

const p = ref<P>('1080p');
const video = ref<HTMLVideoElement | null>(null);

const loadVideo = async (startTime: number = 0) => {
  const videoSrcEndpoint = `http://10.10.2.222:8081/api/v1/video/4-7f9d0d9c/${p.value}`;

  try {
    const response = await fetch(videoSrcEndpoint);
    const result = await response.json();
    console.log('response:', result);

    const blob = new Blob([result], { type: 'application/vnd.apple.mpegurl' });
    const blobUrl = URL.createObjectURL(blob);

    if (Hls.isSupported()) {
      const hls = new Hls({
        loader: CustomKeyLoader
      });

      hls.loadSource(blobUrl);
      hls.attachMedia(video.value!);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.value!.currentTime = startTime;
        video.value!.play();
      });
    } else if (video.value!.canPlayType('application/vnd.apple.mpegurl')) {
      video.value!.src = blobUrl;
      video.value!.addEventListener('loadedmetadata', function () {
        video.value!.currentTime = startTime;
        video.value!.play();
      });
    }

  } catch (error) {
    console.error('Error fetching video source:', error);
  }
};

onMounted(() => {
  loadVideo();
});

watch(p, () => {
  if (video.value) {
    const currentTime = video.value.currentTime;
    loadVideo(currentTime);
  } else {
    loadVideo();
  }
});
</script>

<style scoped lang="scss">
.video-container {
  position: relative;
  width: 100%;
}

.custom-video {
  width: 720px;
  height: auto;
}
</style>
