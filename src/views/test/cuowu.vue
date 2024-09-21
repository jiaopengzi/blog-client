<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 15:06:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 15:06:58
 * @FilePath     : \blog-client\src\views\test\index copy 2.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="video-container">
    <video ref="video" class="custom-video" controls>
    </video>
    <div class="errorInfo">{{ errorInfo }}</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TestVue' })
import { ref, onMounted } from 'vue';
import Hls from 'hls.js';
import { CustomKeyLoader } from '@/pkg/hls';
import { ResponseCode } from '@/api/responseCode';

const video = ref<HTMLVideoElement | null>(null);
const errorInfo = ref<string>('没有错误');

onMounted(async () => {
  const videoSrcEndpoint = 'http://10.10.2.222:8081/api/v1/video/3-8de13d3c/2k';

  try {
    const response = await fetch(videoSrcEndpoint);
    const result = await response.json();

    if (result.code === ResponseCode.GetVideoM3u8Success) {
      const { base_url, m3u8 } = result.data;
      const videoSrc = m3u8.replace(/_url_/g, base_url + "/");

      const blob = new Blob([videoSrc], { type: 'application/vnd.apple.mpegurl' });
      const blobUrl = URL.createObjectURL(blob);

      if (Hls.isSupported()) {
        const hls = new Hls({
          loader: CustomKeyLoader,
          maxBufferLength: 30, // 调整缓冲区长度
          maxMaxBufferLength: 60,
        });

        hls.loadSource(blobUrl);
        hls.attachMedia(video.value!);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.value!.play();
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
          errorInfo.value = 'HLS error: ' + data.type;
          console.error('HLS error:', data);
        });
      } else if (video.value!.canPlayType('application/vnd.apple.mpegurl')) {
        video.value!.src = blobUrl;
        video.value!.addEventListener('error', (e) => {
          errorInfo.value = 'Video playback error: ' + (e as ErrorEvent).message;
          console.error('Video playback error:', e);
        });
        video.value!.addEventListener('stalled', (e) => {
          errorInfo.value = 'Video stalled: ' + (e as Event).type;
          console.error('Video stalled:', e);
        });

        video.value!.addEventListener('abort', (e) => {
          errorInfo.value = 'Video aborted: ' + (e as Event).type;
          console.error('Video aborted:', e);
        });

        video.value!.addEventListener('emptied', (e) => {
          errorInfo.value = 'Video emptied: ' + (e as Event).type;
          console.error('Video emptied:', e);
        });
      } else {
        errorInfo.value = 'HLS is not supported and video element cannot play the provided type.';
        console.error('HLS is not supported and video element cannot play the provided type.');
      }
    } else {
      errorInfo.value = `Error fetching video source: ${result.msg}`;
      console.error(`Error fetching video source: ${result.msg}`);
    }
  } catch (error) {
    errorInfo.value = 'Error during video setup: ' + error;
    console.error('Error during video setup:', error);
  }
});
</script>

<style scoped lang="scss">
.video-container {
  position: relative;
  width: 100%;
}

.custom-video {
  width: 100%;
  height: auto;
}
</style>
