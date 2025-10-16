<template>
    <div class="container">
        <VideoPlayer :player-state="state" :key="state.videoID" />
    </div>
</template>

<script setup lang="ts">
import { PlayerStateManager } from "@/components/player"
import VideoPlayer from "@/components/player"

defineOptions({ name: "MyTest" })

const videoState = new PlayerStateManager()
videoState.setVideoID("m-26-7f9d0d9c")
videoState.setPoster("http://10.10.2.222:7364/api/v1/uploads/2025/10/15/j-25-d6eac413.jpg")
const state = videoState.getState()
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
