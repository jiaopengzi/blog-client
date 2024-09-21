<!--
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
-->
<template>
  <div class="container">
    <VideoPlayer />
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import VideoPlayer from '@/components/player'
import { usePlayerStore, type SubtitlesItem } from '@/stores/player'
defineOptions({ name: 'VideoPlayerTest' })

// 从 store 中获取数据
const palyerStore = usePlayerStore()
// 设置视频地址
palyerStore.setSrc("http://10.10.2.222:8081/api/v1/uploads/test.mp4")

const subtitles = ref<{ [language: string]: SubtitlesItem }>({
  "cn": {
    label: "中文",
    src: "http://10.10.2.222:8081/api/v1/uploads/cn.vtt"
  },
  "en": {
    label: "English",
    src: "http://10.10.2.222:8081/api/v1/uploads/en.vtt"
  }
})

const textWatermark = {
  content: 'jiaopengzi.com1111',
  style: {
    color: 'red',
    fontSize: '14px',
  },
}
palyerStore.setTextWatermark(textWatermark)
palyerStore.setAvailableSubtitles(subtitles.value)

</script>

<style scoped lang="scss">
// 让视频播放器水平垂直居中
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
