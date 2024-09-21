<!--
 * @FilePath     : \blog-client\src\views\test\index.vue
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
  try {
    if (Hls.isSupported()) {
      const hls = new Hls({
        loader: CustomKeyLoader
      });

      hls.loadSource("http://10.10.2.222:8081/api/v1/video/1-8e72860c");
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
      video.value!.addEventListener('loadedmetadata', function () {
        video.value!.play();
      });
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
