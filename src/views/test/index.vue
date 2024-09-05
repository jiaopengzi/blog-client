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
  const videoSrcEndpoint = 'http://localhost:8081/api/v1/video/15-8e72860c';

  try {
    const response = await fetch(videoSrcEndpoint);
    const result = await response.json();

    if (result.code === 8600) {
      const videoSrc = result.data.split('\n').find(line => line.startsWith('http'));

      if (videoSrc) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(videoSrc);
          hls.attachMedia(video.value!);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.value!.play();
          });
        } else if (video.value!.canPlayType('application/vnd.apple.mpegurl')) {
          video.value!.src = videoSrc;
          video.value!.addEventListener('loadedmetadata', function () {
            video.value!.play();
          });
        }
      } else {
        console.error('No valid m3u8 URL found in the response data.');
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
