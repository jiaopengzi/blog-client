<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 19:49:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-10 19:50:02
 * @FilePath     : \blog-client\src\views\test\index copy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div ref="videoContainerRef" class="video-container">
    <video ref="videoRef" controls>
      <source src="http://10.10.2.222:8081/api/v1/uploads/test.mp4" type="video/mp4" id="mp4" />
    </video>

    <i ref="watermarkRef" class="watermark">Moud's Vid</i>
    <button class="fullscreen-button" @click="toggleFullscreen">
      Toggle fullscreen
    </button>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'VideoControls' })
import { onMounted, onUnmounted, useTemplateRef } from 'vue';

const videoContainerRef = useTemplateRef<HTMLElement | null>("videoContainerRef");
const watermarkRef = useTemplateRef<HTMLElement | null>("watermarkRef");
const videoRef = useTemplateRef<HTMLVideoElement | null>("videoRef");

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    videoContainerRef.value?.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

const setRandomPosition = () => {
  const container = videoContainerRef.value;
  const watermark = watermarkRef.value;
  if (container && watermark) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const watermarkWidth = watermark.clientWidth;
    const watermarkHeight = watermark.clientHeight;

    const randomLeft = Math.random() * (containerWidth - watermarkWidth);
    const randomTop = Math.random() * (containerHeight - watermarkHeight);

    watermark.style.left = `${randomLeft}px`;
    watermark.style.top = `${randomTop}px`;
  }
}

onMounted(() => {
  setRandomPosition();
  const intervalId = setInterval(setRandomPosition, 5000);

  const videoElement = videoRef.value;
  if (videoElement) {
    // 阻止单击暂停
    videoElement.addEventListener("click", (event) => {
      event.preventDefault();
    });
    // 添加双击全屏放大功能
    videoElement.addEventListener("dblclick", (event) => {
      event.preventDefault();
    });


  }

  onUnmounted(() => {
    clearInterval(intervalId);
    if (videoElement) {
      videoElement.removeEventListener('dblclick', (event) => {
        event.preventDefault();
      });
    }
  });
});
</script>

<style scoped lang="scss">
.video-container {
  position: relative;
}

video {
  width: 100%;
  height: 100%;
}

.fullscreen-button {
  position: absolute;
  top: 2%;
  left: 90%;
  z-index: 10;
}

.watermark {
  position: absolute;
  color: red;
  z-index: 5;
}
</style>
