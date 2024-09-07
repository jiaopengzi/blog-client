<!--
 * @FilePath     : \blog-client\src\views\test\index.vue
-->
<template>
  <div class="video-container">
    <video ref="video" class="custom-video" controls></video>
    <div class="controls">
      <button @click="togglePlayPause">{{ isPlaying ? 'Pause' : 'Play' }}</button>
      <input type="range" min="0" :max="duration" v-model="currentTime" @input="seekVideo" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TestVue' })
import { ref, onMounted } from 'vue';
import Hls from 'hls.js';

const video = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const duration = ref(0);
const currentTime = ref(0);

const togglePlayPause = () => {
  if (video.value) {
    if (isPlaying.value) {
      video.value.pause();
    } else {
      video.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};

const seekVideo = () => {
  if (video.value) {
    video.value.currentTime = currentTime.value;
  }
};

onMounted(async () => {
  const videoSrcEndpoint = 'http://10.10.2.222:8081/api/v1/video/13-91bc0928/1080p';

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
          duration.value = video.value!.duration;
        });
      } else if (video.value!.canPlayType('application/vnd.apple.mpegurl')) {
        video.value!.src = blobUrl;
        video.value!.addEventListener('loadedmetadata', function () {
          video.value!.play();
          duration.value = video.value!.duration;
        });
      }

      video.value!.addEventListener('timeupdate', () => {
        currentTime.value = video.value!.currentTime;
      });
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
  width: 100%;
  height: auto;
}

.controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
}

.controls button {
  background: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.controls input[type="range"] {
  flex: 1;
  margin: 0 10px;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity .2s;
}

.controls input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}

.controls input[type="range"]::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}
</style>
