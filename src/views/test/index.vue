<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-18 18:33:03
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div class="container">
        <VideoPlayer :player-props="state" />
    </div>
</template>

<script setup lang="ts">
import { UsePlayerProps } from "@/components/player"
import VideoPlayer from "@/components/player"
// import VideoPlayer from "./index1.vue"

defineOptions({ name: "MyTest" })

const videoState = new UsePlayerProps()
videoState.setSrc("2-7f9d0d9c")
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
