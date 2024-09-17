<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-17 10:03:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-17 18:17:06
 * @FilePath     : \blog-client\src\components\player\index.vue
 * @Description  : 视频播放器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div ref="videoContainerRef" class="video-container">
        <VideoWatermark :text-watermark="textContent" :logo-watermark="logo">
            <!-- video元素不使用默认的 controls-->
            <video ref="videoRef">
                <source src="http://10.10.2.222:8081/api/v1/uploads/test.mp4" type="video/mp4" id="mp4" />
            </video>

            <!-- 视频控制器 -->
            <div class="controls-Container">
                <Controls class="controls" :el-popover-append-to-element="videoContainerRef" />
            </div>
        </VideoWatermark>
    </div>
</template>

<script setup lang="ts">

import { useTemplateRef, onMounted, watchEffect, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import type { TextWatermark, LogoWatermark } from '@/stores/player'

import Controls from '@/components/player/components/controls'
import VideoWatermark from '@/components/player/components/watermark'

// 从 store 中获取数据
const palyerStore = usePlayerStore()
const { isFullScreen } = storeToRefs(palyerStore)

// 文字水印内容
const textContent: TextWatermark = {
    content: '焦棚子',
    style: {
        color: 'red',
        fontSize: '14px',
    }
}

// logo 水印内容
const logo: LogoWatermark = {
    imgUrl: 'https://jiaopengzi.com/wp-content/uploads/2021/10/220-50-1-YJ.png',
    style: {
        width: '219px',
        height: '50px',
        right: '0',
        top: '20px',
        opacity: "1",
    }
}
defineOptions({ name: 'VideoPlayer' })

const videoContainerRef = useTemplateRef<HTMLElement | null>("videoContainerRef");
const videoRef = useTemplateRef<HTMLVideoElement | null>("videoRef");

// 监控是否全屏 
watchEffect(() => {
    if (isFullScreen.value) {
        console.log('full screen')
        if (videoContainerRef.value) {
            videoContainerRef.value.requestFullscreen();
        }
    }
})


onMounted(() => {
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

    document.addEventListener('fullscreenchange', handleFullscreenChange);

});

const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
        palyerStore.exitFullScreen();
    }
}

onUnmounted(() => {
    const videoElement = videoRef.value;
    if (videoElement) {
        videoElement.removeEventListener('dblclick', (event) => {
            event.preventDefault();
        });
    }
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<style scoped lang="scss">
.video-container {
    position: relative;
    width: 720px;
    height: 405px;

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .controls-Container {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));

        .controls {
            position: absolute;
            bottom: 0;
            // 总宽度减去左右两边各10px的空隙
            left: 10px;
            width: calc(100% - 20px);
            background-color: rgba(0, 0, 0, 0);
        }
    }
}
</style>