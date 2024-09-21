<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 18:05:11
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 18:05:15
 * @FilePath     : \blog-client\src\views\test\index copy 2.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!--
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
-->
<template>
  <div>
    <video ref="video" controls></video>
    <div>
      <button v-for="(level, index) in levels" :key="index" @click="switchQuality(index)">
        {{ level.label }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import Hls from 'hls.js';

const video = ref<HTMLVideoElement | null>(null);
const hls = ref<Hls | null>(null);
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

const switchQuality = (index: number) => {
  if (hls.value) {
    hls.value.currentLevel = index;
  }
};

onMounted(async () => {
  const response = await fetch('http://10.10.2.222:8081/api/v1/video/5-c19424aa');
  const data = await response.json();
  const masterPlaylistUrl = data.data;
  console.log('masterPlaylistUrl', masterPlaylistUrl);

  const masterPlaylistStr = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=641840,RESOLUTION=1920x1080,CODECS="avc1.42c028,mp4a.40.2"
http://10.10.2.222:8081/api/v1/uploads/target/original/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=5640800,RESOLUTION=1920x1080,CODECS="avc1.42c029,mp4a.40.2"
http://10.10.2.222:8081/api/v1/uploads/target/1080/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=2890800,RESOLUTION=1280x720,CODECS="avc1.42c029,mp4a.40.2"
http://10.10.2.222:8081/api/v1/uploads/target/720/index.m3u8
`
  // 将 masterPlaylistStr 转换为 Blob 对象
  const masterPlaylistBlob = new Blob([masterPlaylistStr], { type: 'application/vnd.apple.mpegurl' });

  if (Hls.isSupported()) {
    hls.value = new Hls();

    hls.value.on(Hls.Events.LEVEL_LOADED, (event, data) => {
      console.log('LEVEL_LOADED', data);
      const baseUrl = data.details.url.split('/').slice(0, -1).join('/') + '/';
      data.details.fragments.forEach(fragment => {
        fragment.url = baseUrl + fragment.url;
      });
    });

    hls.value.loadSource(masterPlaylistUrl1);
    hls.value.attachMedia(video.value!);
    hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('MANIFEST_PARSED', hls.value!.levels);
      levels.splice(0, levels.length, ...hls.value!.levels.map(level => ({
        height: level.height,
        label: getClosestQualityLabel(level.height)
      })));
      video.value!.play();
    });
  } else if (video.value!.canPlayType('application/vnd.apple.mpegurl')) {
    video.value!.src = masterPlaylistUrl;
    video.value!.addEventListener('loadedmetadata', () => {
      video.value!.play();
    });
  }
});
</script>

<style scoped lang="scss">
video {
  width: 720px;
  height: auto;
}

button {
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
