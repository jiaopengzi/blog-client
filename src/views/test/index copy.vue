<!--
 * @FilePath     : \blog-client\src\views\test\index copy.vue
 * @Description  : 
-->
<template>
    <div class="container">
        <VideoPlayer />
    </div>
    <video src="http://10.10.2.222:8081/api/v1/uploads/test.mp4" controls></video>
</template>

<script setup lang="ts">
import { ref } from "vue"
import VideoPlayer from "@/components/player"
import { usePlayerStore, type SubtitlesItem, MediaTypes } from "@/stores/player"
defineOptions({ name: "VideoPlayerTest" })

// 从 store 中获取数据
const playerStore = usePlayerStore()

// 设置视频地址
// playerStore.setMediaType(MediaTypes.MP4) // 静音
// playerStore.setSrc("http://10.10.2.222:8081/api/v1/uploads/test.mp4")
playerStore.setPoster("http://10.10.2.222:8081/api/v1/uploads/poster.png")

playerStore.setMediaType(MediaTypes.HLS) // 静音
// playerStore.setSrc("6-c19424aa") // 多清晰度 免费 不加密
// playerStore.setSrc("8-8e72860c") // 多清晰度 付费 加密
playerStore.setSrc("9-31df6df9") // 单清晰度 免费 不加密

const subtitles = ref<{ [language: string]: SubtitlesItem }>({
    cn: {
        label: "中文",
        src: "http://10.10.2.222:8081/api/v1/uploads/cn.vtt",
    },
    en: {
        label: "English",
        src: "http://10.10.2.222:8081/api/v1/uploads/en.vtt",
    },
})

const textWatermark = {
    content: "jiaopengzi.com1111",
    style: {
        color: "red",
        fontSize: "14px",
    },
}
playerStore.setTextWatermark(textWatermark)
playerStore.setAvailableSubtitles(subtitles.value)
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
