<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-07 17:44:08
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="video-container">
    <video ref="videoRef" controls>
      <source :src="videoSrc" type="video/mp4" />
      <track kind="subtitles" srcLang="en" label="English" :src="subtitlesBlobUrl" default />
      <track kind="subtitles" srcLang="en1" label="English1" :src="subtitlesBlobUrl" />
    </video>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';

// 视频地址
const videoSrc = 'http://10.10.2.222:8081/api/v1/uploads/test.mp4';

// 字幕内容
const subtitlesPlaceholder = ref(`WEBVTT

1
00:00:00.000 --> 00:00:03.000
Hello, world!

2
00:00:03.000 --> 00:01:06.000
This is a WebVTT file.
`);

// 创建一个 Blob URL 用于字幕文件
const subtitlesBlobUrl = ref<string | null>(null);

onMounted(() => {
  const blob = new Blob([subtitlesPlaceholder.value], { type: 'text/vtt;charset=utf-8' });
  subtitlesBlobUrl.value = URL.createObjectURL(blob);

  console.log('subtitlesBlobUrl', subtitlesBlobUrl.value);
});

// 清理 Blob URL
watch(subtitlesBlobUrl, (newUrl, oldUrl) => {
  if (oldUrl) {
    URL.revokeObjectURL(oldUrl);
  }
});

const videoRef = ref<HTMLVideoElement | null>(null);
</script>

<style scoped lang="scss">
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;

  video {
    width: 80%;
    max-width: 800px;
    border: 2px solid #fff;
  }
}
</style>
