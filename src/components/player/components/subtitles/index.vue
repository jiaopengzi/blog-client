<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-24 09:43:15
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-24 09:44:39
 * @FilePath     : \blog-client\src\components\player\components\subtitles\index.vue
 * @Description  : 自定义字幕组件-待完善
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <div class="video-container">
        <video ref="video" controls>
            <source src="http://10.10.2.222:8081/api/v1/uploads/test.mp4" type="video/mp4" />
        </video>
        <CustomSubtitles :current-time="currentTime" :vtt-url="vttUrl" />
    </div>
</template>

<script lang="ts" setup>
// TODO: 自定义字幕组件

import { onMounted, ref } from "vue"

import CustomSubtitles from "./subtitles.vue"

defineOptions({ name: "VideoSubtitles" })

const videoElement = ref<HTMLVideoElement | null>(null)
const currentTime = ref(0)

const vttUrl = ref("http://10.10.2.222:8081/api/v1/uploads/cn.vtt")

onMounted(() => {
    videoElement.value = document.querySelector("video")
    videoElement.value?.addEventListener("timeupdate", () => {
        currentTime.value = videoElement.value?.currentTime || 0
    })
})
</script>

<style scoped lang="scss">
.video-container {
    position: relative;

    video {
        width: 720px;
        height: 480px;
    }
}
</style>
