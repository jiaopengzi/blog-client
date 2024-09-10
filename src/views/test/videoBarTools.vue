<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 19:06:03
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-10 19:06:07
 * @FilePath     : \blog-client\src\views\test\index copy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="controls">
    <button @click="togglePlayPause">{{ isPlaying ? 'Pause' : 'Play' }}</button>
    <input type="range" min="0" :max="duration" v-model="currentTime" @input="seekVideo" />
  </div>

</template>

<script setup lang="ts">
defineOptions({ name: 'VideoControls' })
import { ref, onMounted } from 'vue';


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
