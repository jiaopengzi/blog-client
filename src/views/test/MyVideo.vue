<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-10-16 17:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-16 17:04:52
 * @FilePath     : \blog-client\src\views\test\MyVideo.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- src/components/MyVideo.vue -->
<template>
    <div class="my-video">
        <!-- 这里假设您有一个视频播放器组件或者直接使用 video 标签 -->
        <video :src="videoSrc" controls></video>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const props = defineProps<{ videoID: string }>()
const videoSrc = ref(`http://10.10.2.222:5426/api/v1/uploads/${props.videoID}.mp4`)
</script>

<style scoped>
.my-video {
    /* 样式定义 */
}
</style>
