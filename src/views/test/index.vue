<!--
 * @FilePath     : \blog-client\src\views\test\index.vue
-->
<template>
  <div>
    <video ref="video" controls></video>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TestVue' })
import { ref, onMounted } from 'vue';
import Hls from 'hls.js';

const video = ref<HTMLVideoElement | null>(null);

onMounted(async () => {
  const videoSrcEndpoint = 'http://10.10.2.222:8081/api/v1/video/6-8e72860c/1080p';

  try {
    const response = await fetch(videoSrcEndpoint);
    const result = await response.json();

    if (result.code === 8602) {
      const { base_url, m3u8 } = result.data;
      const videoSrc = m3u8.replace(/_url_/g, base_url + "/");

      const blob = new Blob([videoSrc], { type: 'application/vnd.apple.mpegurl' });
      const blobUrl = URL.createObjectURL(blob);

      if (Hls.isSupported()) {
        const hls = new Hls();
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
video {
  width: 100%;
  height: auto;
}
</style>
