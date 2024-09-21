<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 15:55:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 18:41:23
 * @FilePath     : \blog-client\src\views\test\单一hls.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 15:55:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 15:55:25
 * @FilePath     : \blog-client\src\views\test\indexVideo copy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="video-container">
    <video ref="video" class="custom-video" controls>
    </video>

  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TestVue' })
import { ref, onMounted } from 'vue';
import Hls from 'hls.js';
import { CustomKeyLoader } from '@/pkg/hls';
import { ResponseCode } from '@/api/responseCode';

const video = ref<HTMLVideoElement | null>(null);

onMounted(async () => {
  const videoSrcEndpoint = 'http://10.10.2.222:8081/api/v1/video/2-91bc0928/1080p';

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
          loader: CustomKeyLoader
        });

        hls.loadSource(blobUrl);
        hls.attachMedia(video.value!);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.value!.play();
        });
      } else if (video.value!.canPlayType('application/vnd.apple.mpegurl')) {
        video.value!.src = blobUrl;
        video.value!.addEventListener('loadedmetadata', function () {
          video.value!.play();
        });
      }

    } else {
      console.error(`Error fetching video source: ${result.msg}`);
    }
  } catch (error) {
    console.error('Error fetching video source:', error);
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
