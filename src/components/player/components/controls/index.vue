<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-10 19:53:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-11 17:32:06
 * @FilePath     : \blog-client\src\components\player\components\controls\index.vue
 * @Description  : 视频控制器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<template>

    <!-- 视频控制器 -->
    <div ref="controls" class="controls">

        <!-- 播放暂停按钮 -->
        <button ref="playPause" class="controls-btn play-pause" @click="togglePlayPause">
            <Icon :name="IconNamePlayPause" customClass="iconfont" />
        </button>

        <!-- 视频进度条 -->
        <ProgressBar ref="progressBar" :playProgress="playProgress" @seek="seekVideo" />

        <!-- 时间显示 -->
        <div ref="timeDisplay" class="timeDisplay">{{ timeDisplay }}</div>

        <!-- 静音按钮 -->
        <button ref="mute" class="controls-btn" @click="toggleMute">
            <Icon :name="IconNameMute" customClass="iconfont" />
        </button>

        <!-- 音量控制 -->
        <el-slider ref="volume" class="volume" v-model="volume.volume" size="small" @input="seekVolume" />

        <!-- 设置 播放速度 清晰度 字幕 -->
        <button ref="setting" class="controls-btn" @click="showSetting">
            <Icon :name="IconKeys.Setting" customClass="iconfont" />
        </button>

        <button ref="pip" class="controls-btn" @click="togglePIP">
            <Icon :name="IconKeys.PictureInPicture" customClass="iconfont" />
        </button>

        <!-- 网页全屏 -->
        <button ref="webFullscreen" class="controls-btn" @click="toggleWebFullscreen">
            <Icon :name="IconKeys.WebFullscreen" customClass="iconfont" />
        </button>

        <!-- 全屏 -->
        <button ref="fullscreen" class="controls-btn" @click="toggleFullscreen">
            <Icon :name="IconKeys.Fullscreen" customClass="iconfont" />
        </button>
    </div>

</template>

<script setup lang="ts">
import { ref, useTemplateRef, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { IconKeys } from '@/components/common/icons'
import { formatDurationTime } from '@/utils/dateTime'
import ProgressBar from '@/components/player/components/progress-bar'

import { usePlayerStore, PlayStatus, PlayLevel, PlaySpeed, WatermarkType } from '@/stores/player'
import type { PlayProgress, Subtitle, SubtitleStatus, Position, Logo, TextWatermark, Watermark, PlayerSize } from '@/stores/player'


defineOptions({ name: 'VideoControls' })

// 从 store 中获取数据
const palyerStore = usePlayerStore()
const { playStatus, playProgress, isWebFullScreen, isFullScreen,
    playLevel, playSpeed, volume, showControlBar,
    useVideoControls, subtitles, isPictureInPicture, size, isMobile } = storeToRefs(palyerStore)


// 定义所有的元素的 ref
const controlsRef = useTemplateRef<HTMLElement | null>("controls")
const playPauseRef = useTemplateRef<HTMLButtonElement | null>("playPause")
const progressBarRef = useTemplateRef<HTMLDivElement | null>("progressBar")
const timeDisplayRef = useTemplateRef<HTMLSpanElement | null>("timeDisplay")
const volumeRef = useTemplateRef<HTMLInputElement | null>("volume")
const settingRef = useTemplateRef<HTMLButtonElement | null>("setting")
const pipRef = useTemplateRef<HTMLButtonElement | null>("pip")
const webFullscreenRef = useTemplateRef<HTMLButtonElement | null>("webFullscreen")
const fullscreenRef = useTemplateRef<HTMLButtonElement | null>("fullscreen")
const sliderRef = useTemplateRef<HTMLDivElement | null>("slider") // 新增滑块的 ref


const IconNamePlayPause = ref(IconKeys.Pause)
const IconNameMute = ref(IconKeys.Unmute)

const seekVideo = (currentTime: number) => {
    console.log('seekVideo', currentTime)
    playProgress.value.currentTime = currentTime
}

const seekVolume = () => {
    palyerStore.setVolume(volume.value.volume)
}


// 切换播放暂停
const togglePlayPause = () => {
    palyerStore.togglePlayPause()
    if (playStatus.value === PlayStatus.PLAYING) {
        IconNamePlayPause.value = IconKeys.Play
    } else {
        IconNamePlayPause.value = IconKeys.Pause
    }
}


// 切换静音
const toggleMute = () => {
    palyerStore.toggleMute()
    if (volume.value.muted) {
        IconNameMute.value = IconKeys.Mute
    } else {
        IconNameMute.value = IconKeys.Unmute
    }
}


const timeDisplay = computed(() => {
    const currentFormatted = formatDurationTime(playProgress.value.currentTime)
    const durationFormatted = formatDurationTime(playProgress.value.duration)
    return `${currentFormatted} / ${durationFormatted}`
})


// 显示设置
const showSetting = () => {
    console.log('showSetting')
}

// 切换画中画
const togglePIP = () => {
    palyerStore.togglePictureInPicture()
}

// 切换网页全屏
const toggleWebFullscreen = () => {
    palyerStore.toggleWebFullScreen()
}

// 切换全屏
const toggleFullscreen = () => {
    palyerStore.toggleFullScreen()
}

</script>



<style scoped lang="scss">
.controls {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // 控制器背景透明
    background: rgba(0, 0, 0, 0);
    padding: 10px;
    border-radius: 5px;
}

.timeDisplay {
    // 保持在一行
    white-space: nowrap;
    margin: 0 10px;
}

.volume {
    width: 150px;
    margin: 0 8px;
}

.controls-btn {
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 2px;
}

.iconfont {
    font-size: 24px;
    fill: rgba(255, 255, 255, 0.9);
    transition: fill 0.3s ease;
    /* 添加平滑过渡效果 */
}

.iconfont:hover {
    fill: rgba(255, 255, 255, 1.0);
    /* 悬停时的颜色变化 */
}
</style>
