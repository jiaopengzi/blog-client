<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-15 12:43:36
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-15 14:10:00
 * @FilePath     : \blog-client\src\components\player\components\video\index.vue
 * @Description  : 视频播放器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div ref="videoContainerRef" class="video-container">

        <!-- video元素不使用默认的 controls-->
        <video ref="videoRef">
            <source src="http://10.10.2.222:8081/api/v1/uploads/test.mp4" type="video/mp4" id="mp4" />
        </video>

        <!-- <i ref="watermarkRef" class="watermark">Moud's Vid</i> -->
        <!-- <img ref="watermarkRef" class="watermark" src="https://image.jiaopengzi.com/blog/202310161115509.png" /> -->

        <!-- 视频控制器 -->
        <div class="controls-Container">
            <Controls class="controls" />
        </div>

    </div>
</template>

<script setup lang="ts">

import { ref, useTemplateRef, computed, watch, onMounted, watchEffect, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import Controls from '@/components/player/components/controls'
import { debounce } from 'throttle-debounce'
import { usePlayerStore, PlayStatus, PlayLevelItem, PlaySpeed, WatermarkType } from '@/stores/player'
import type { PlayProgress, Subtitle, SubtitleStatus, Position, Logo, TextWatermark, Watermark, PlayerSize } from '@/stores/player'
import { pl } from 'element-plus/es/locale/index.mjs'

// 从 store 中获取数据
const palyerStore = usePlayerStore()
const { playStatus, playProgress, isWebFullScreen, isFullScreen,
    playLevel, playSpeed, volume, showControlBar,
    useVideoControls, subtitles, isPictureInPicture, size, isMobile, isLoop } = storeToRefs(palyerStore)

defineOptions({ name: 'VideoPlayer' })

const videoContainerRef = useTemplateRef<HTMLElement | null>("videoContainerRef");
const watermarkRef = useTemplateRef<HTMLElement | null>("watermarkRef");
const videoRef = useTemplateRef<HTMLVideoElement | null>("videoRef");

// 监控是否全屏 
watchEffect(() => {
    if (isFullScreen.value) {
        console.log('full screen')
        videoContainerRef.value?.requestFullscreen();
    }
})

const setRandomPosition = () => {
    const container = videoContainerRef.value;
    const watermark = watermarkRef.value;
    if (container && watermark) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const watermarkWidth = watermark.clientWidth;
        const watermarkHeight = watermark.clientHeight;

        const randomLeft = Math.random() * (containerWidth - watermarkWidth);
        const randomTop = Math.random() * (containerHeight - watermarkHeight);

        watermark.style.left = `${randomLeft}px`;
        watermark.style.top = `${randomTop}px`;
    }
}

onMounted(() => {
    setRandomPosition();
    const intervalId = setInterval(setRandomPosition, 5000);

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

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            palyerStore.exitFullScreen();
        }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    onUnmounted(() => {
        clearInterval(intervalId);
        if (videoElement) {
            videoElement.removeEventListener('dblclick', (event) => {
                event.preventDefault();
            });
        }
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
    });
});
</script>

<style scoped lang="scss">
.video-container {
    position: relative;
}

video {
    width: 100%;
    height: 100%;
}

.controls-Container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2));

    .controls {
        position: absolute;
        bottom: 0;
        // 总宽度减去左右两边各10px的空隙
        left: 10px;
        width: calc(100% - 20px);
        background: rgba(0, 0, 0, 0.0);
    }
}



.watermark {
    position: absolute;
    color: red;
    z-index: 5;
}
</style>