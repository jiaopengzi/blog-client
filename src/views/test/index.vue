<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2025-03-13 13:06:57
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="container">
        <VideoPlayer :player-state="state" />
    </div>
</template>

<script setup lang="ts">
import { PlayerStateManager } from "@/components/player"
import VideoPlayer from "@/components/player"

defineOptions({ name: "MyTest" })

const videoState = new PlayerStateManager()
// videoState.set
videoState.setSrc("http://10.10.2.222:7364/api/v1/uploads/2025/03/13/m-19-8de13d3c.mp4")
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
