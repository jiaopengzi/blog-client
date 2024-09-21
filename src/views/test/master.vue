<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 18:36:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 18:36:18
 * @FilePath     : \blog-client\src\views\test\index copy 2.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 15:55:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 18:35:29
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="video-container">
    <video ref="video" class="custom-video" controls muted>
    </video>

  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TestVue' })
import { ref, onMounted, reactive } from 'vue';
import Hls from 'hls.js';
import { CustomKeyLoader } from '@/pkg/hls';
import { ResponseCode } from '@/api/responseCode';

const video = ref<HTMLVideoElement | null>(null);

const levels = reactive<{ height: number, label: string }[]>([]);

const qualityLabels: Record<number, string> = {
  2160: '4K',
  1440: '2K',
  1080: '1080p',
  720: '720p',
  480: '480p',
  360: '360p',
  240: '240p'
};

const getClosestQualityLabel = (height: number): string => {
  const heights = Object.keys(qualityLabels).map(Number).sort((a, b) => a - b);
  let closest = heights[0];
  for (const h of heights) {
    if (Math.abs(h - height) < Math.abs(closest - height)) {
      closest = h;
    }
  }
  return qualityLabels[closest] || `${height}p`;
};



onMounted(async () => {
  const videoSrcEndpoint = 'http://10.10.2.222:8081/api/v1/uploads/target/main.m3u8';

  try {
    const response = await fetch(videoSrcEndpoint);
    const result = await response.json();

    if (result.code === ResponseCode.GetVideoMainM3u8Success) {
      const { base_url, m3u8 } = result.data;
      const videoSrc = result.data;
      console.log('videoSrc:', videoSrc);
      const blob = new Blob([videoSrc], { type: 'application/vnd.apple.mpegurl' });
      console.log('blob:', blob);
      const blobUrl = URL.createObjectURL(blob);
      console.log('blobUrl:', blobUrl);

      if (Hls.isSupported()) {
        const hls = new Hls({
          loader: CustomKeyLoader
        });

        hls.loadSource(blobUrl);
        hls.attachMedia(video.value!);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          console.log('MANIFEST_PARSED', hls!.levels);
          levels.splice(0, levels.length, ...hls!.levels.map(level => ({
            height: level.height,
            label: getClosestQualityLabel(level.height)
          })));
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
