<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-17 10:03:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-18 22:45:54
 * @FilePath     : \blog-client\src\components\player\index.vue
 * @Description  : 视频播放器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div ref="videoContainerRef" class="video-container" @fullscreenchange="handleFullscreenChange"
        @mousemove="handleMousemove" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
        <VideoWatermark :text-watermark="textWatermark" :logo-watermark="logoWatermark">
            <!-- video元素不使用默认的 controls-->
            <video ref="videoRef" :src="src" @timeupdate="handleTimeupdate" @loadedmetadata="handleLoadedmetadata">
                <!-- <track v-if="isShowSubtitles" src="http://10.10.2.222:8081/api/v1/uploads/cn.vtt" kind="subtitles" srclang="cn" label="中文" default /> -->
                <track v-if="isShowSubtitles" :src="subtitlesSrc" kind="subtitles" :srclang="srclang"
                    :label="subtitlesLabel" default />
            </video>
            <!-- 视频控制器 -->
            <div class="controls-Container" :class="{ hidden: controlsHidden }">
                <Controls class="controls" :el-popover-append-to-element="videoContainerRef" />
            </div>
        </VideoWatermark>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore, PlayStatus, DisabledSubtitles } from '@/stores/player'
import Controls from '@/components/player/components/controls'
import VideoWatermark from '@/components/player/components/watermark'

defineOptions({ name: 'VideoPlayer' })

// 从 store 中获取数据
const playerStore = usePlayerStore()
const { src, isWebFullScreen, isFullScreen, isPictureInPicture, size, textWatermark, logoWatermark, playStatus, playProgress, playLevel, playbackRate, volume, subtitles, isLoop, isUserInput } = storeToRefs(playerStore)

const videoContainerRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)

// 是否显示字幕选择
const isShowSubtitles = computed(() => subtitles.value && Object.keys(subtitles.value).length > 0)

// 字幕 src
const subtitlesSrc = computed(() => {
    if (subtitles.value && subtitles.value.availableSubtitles && subtitles.value.selectedSubtitlesLanguage) {
        const availableSubtitles = {
            ...DisabledSubtitles,
            ...subtitles.value.availableSubtitles
        }
        return availableSubtitles[subtitles.value.selectedSubtitlesLanguage].src
    }
    return ''
})

// 字幕语言
const srclang = computed(() => {
    if (subtitles.value && subtitles.value.selectedSubtitlesLanguage) {
        return subtitles.value.selectedSubtitlesLanguage
    }
    return ''
})

// 字幕 label
const subtitlesLabel = computed(() => {
    if (subtitles.value && subtitles.value.availableSubtitles && subtitles.value.selectedSubtitlesLanguage) {
        const availableSubtitles = {
            ...DisabledSubtitles,
            ...subtitles.value.availableSubtitles
        }
        return availableSubtitles[subtitles.value.selectedSubtitlesLanguage].label
    }
    return ''
})

// 控制器显示隐藏
const controlsHidden = ref(true)
let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null

// 鼠标移动事件
const handleMousemove = () => {
    controlsHidden.value = false
    if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
    hideControlsTimeout = setTimeout(() => {
        controlsHidden.value = true
    }, 2000)
}

// 鼠标进入事件
const handleMouseenter = () => {
    controlsHidden.value = false
}

// 鼠标离开事件
const handleMouseleave = () => {
    controlsHidden.value = true
}


// 监控是否全屏
watchEffect(() => {
    if (isFullScreen.value) {
        if (videoContainerRef.value) videoContainerRef.value.requestFullscreen()
    } else {
        if (document.fullscreenElement) document.exitFullscreen()
    }
})

// 监控网页全屏状态,video 没有全屏
watchEffect(() => {
    if (isWebFullScreen.value) {
        if (videoContainerRef.value && videoRef.value) {
            videoContainerRef.value.style.width = '100vw'
            videoContainerRef.value.style.height = '100vh'
            videoRef.value.style.width = '100vw'
            videoRef.value.style.height = '100vh'
        }
    } else {
        if (videoContainerRef.value && videoRef.value) {
            videoRef.value.style.width = '100%'
            videoRef.value.style.height = '100%'
            videoContainerRef.value.style.width = size.value.width + 'px'
            videoContainerRef.value.style.height = size.value.height + 'px'
        }
    }
})

// 监控画中画状态
watchEffect(() => {
    if (videoRef.value && isPictureInPicture.value) {
        videoRef.value.requestPictureInPicture()
    }
    if (!isPictureInPicture.value && document.pictureInPictureElement) {
        document.exitPictureInPicture()
    }
})

// 根据 size 设置 video 容器的宽高
watchEffect(() => {
    if (videoContainerRef.value) {
        videoContainerRef.value.style.width = size.value.width + 'px'
        videoContainerRef.value.style.height = size.value.height + 'px'
    }
})

// 根据 playStatus 控制 video 播放暂停
watchEffect(() => {
    if (videoRef.value) playStatus.value === PlayStatus.PLAYING ? videoRef.value.play() : videoRef.value.pause()
})

// 视频加载完成
const handleLoadedmetadata = () => {
    if (videoRef.value) {
        updateStore()
    }
}

// 监听 video 元素的 timeupdate 事件
const handleTimeupdate = () => {
    if (isUserInput.value || playProgress.value.isDragging) return
    if (videoRef.value) {
        playerStore.setUserInput(false)
        playerStore.setCurrentTime(videoRef.value.currentTime)
    }
}

// 监听用户输入进度变化
watchEffect(() => {
    if (!isUserInput.value) return
    if (videoRef.value) {
        videoRef.value.currentTime = playProgress.value.currentTime
        playerStore.setUserInput(false)
    }
})

// 监控音量变化
watchEffect(() => {
    if (videoRef.value) videoRef.value.volume = volume.value.volume / 100
})

// 监控播放速度变化
watchEffect(() => {
    if (videoRef.value) videoRef.value.playbackRate = playbackRate.value
})

// 监控是否循环播放
watchEffect(() => {
    if (videoRef.value) videoRef.value.loop = isLoop.value
})

// 根据video元素更新 store 中的数据
const updateStore = () => {
    if (videoRef.value) {
        playerStore.setCurrentTime(videoRef.value.currentTime)
        playerStore.setDuration(videoRef.value.duration)
        playerStore.setIsDragging(false)
        playerStore.setPlaybackRate(videoRef.value.playbackRate)
        videoRef.value.loop = isLoop.value
        videoRef.value.volume = volume.value.volume / 100
    }
}

onMounted(() => {
    if (videoRef.value) {
        handleLoadedmetadata()
    }
})

const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
        playerStore.exitFullScreen()
    }
}
</script>

<style scoped lang="scss">
.video-container {
    position: relative;

    video {
        object-fit: cover;
        width: 100%;
        height: 100%;
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
        transition: opacity 0.8s;
        opacity: 1;
    }

    // 控制器隐藏
    .controls-Container.hidden {
        opacity: 0;
    }

    .controls {
        position: absolute;
        bottom: 0;
        left: 10px;
        width: calc(100% - 20px);
        background-color: rgba(0, 0, 0, 0);
    }
}
</style>