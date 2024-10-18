<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-17 17:43:01
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-18 10:27:17
 * @FilePath     : \blog-client\src\views\test\视频.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
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
import VideoPlayer from "@/components/player"
defineOptions({ name: "MyTest" })
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
