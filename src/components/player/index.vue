<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-17 10:03:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-22 16:32:42
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
            <video ref="videoRef" :src="src" @timeupdate="handleTimeupdate" @loadedmetadata="handleLoadedmetadata"
                @progress="handleProgress" playsinline webkit-playsinline x5-video-player-type="h5"
                x5-video-player-fullscreen="true">
                <!-- <track v-if="isShowSubtitles" src="http://10.10.2.222:8081/api/v1/uploads/cn.vtt" kind="subtitles" srclang="cn" label="中文" default /> -->
                <track v-if="isShowSubtitles" :src="subtitlesSrc" kind="subtitles" :srclang="srclang"
                    :label="subtitlesLabel" default />
            </video>
            <!-- 视频控制器 -->
            <div ref="controlsContainerRef" class="controls-Container" :class="{ hidden: controlsHidden }"
                @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
                <Controls class="controls" :el-popover-append-to-element="videoContainerRef" />
            </div>

            <!-- 播放按钮 -->
        </VideoWatermark>
        <div v-if="showPlayButton" class="play-button-page" @click="togglePlayPause" @dblclick="handleDblclick">
            <Icon :name="IconKeys.Play" customClass="iconfont" />
        </div>
        <div v-if="!showPlayButton" class="play-to-paused-page" @click="togglePlayPause" @dblclick="handleDblclick">
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, onBeforeUnmount, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import screenfull from "screenfull"
import { MediaTypes, usePlayerStore, PlayStatus, DisabledSubtitles, getVideoQualityLabel, type PlayLevelLabel } from '@/stores/player'
import Controls from '@/components/player/components/controls'
import VideoWatermark from '@/components/player/components/watermark'
import { MsgType } from '@/components/common'
import { IconKeys } from '@/components/common/icons'
import Hls from 'hls.js';
import { CustomLoader } from '@/pkg/hls';

defineOptions({ name: 'VideoPlayer' })

// 从 store 中获取数据
const playerStore = usePlayerStore()
const { mediaType, src, isWebFullScreen, isFullScreen, isPictureInPicture,
    size, textWatermark, logoWatermark, playStatus, playProgress,
    playLevel, playbackRate, volume, subtitles, isLoop, isUserInput, isMobile } = storeToRefs(playerStore)

// 根据当前环境更新 isMobile 
playerStore.setIsMobile(/mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

// 定义 video 元素的 ref
const videoContainerRef = useTemplateRef<HTMLElement | null>("videoContainerRef")
const videoRef = useTemplateRef<HTMLVideoElement | null>("videoRef")
const controlsContainerRef = useTemplateRef<HTMLElement | null>("controlsContainerRef")

// 是否显示播放按钮
const showPlayButton = computed(() => playStatus.value !== PlayStatus.PLAYING)

// 切换播放暂停
const togglePlayPause = () => {
    playerStore.togglePlayPause()
}

// 处理视频页面双击事件
const handleDblclick = () => {
    // 判断是否是网页全屏
    if (isWebFullScreen.value) {
        playerStore.toggleWebFullScreen()
        return
    }

    // 判断是否是画中画
    if (isPictureInPicture.value) {
        playerStore.togglePictureInPicture()
        return
    }

    // 判断是否是全屏
    playerStore.toggleFullScreen()
}

// 处理视频进度
const handleProgress = () => {
    handleProgressbuffered()
}

// 处理缓存进度
const handleProgressbuffered = () => {
    if (videoRef.value) {
        // 更新缓存进度
        const buffered = videoRef.value.buffered;
        if (buffered.length > 0) {
            const bufferedEnd = buffered.end(buffered.length - 1)
            console.log('buffered:', bufferedEnd)
            playerStore.setBuffered(bufferedEnd)
        }
    }
}



// 是否显示字幕选择
const isShowSubtitles = computed(() => subtitles.value && Object.keys(subtitles.value).length > 0)

// 字幕 src
const subtitlesSrc = computed(() => {
    if (subtitles.value && subtitles.value.availableSubtitles && subtitles.value.selectedSubtitlesLanguage) {
        const availableSubtitles = {
            ...DisabledSubtitles, // 确保不会出现 undefined
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
const handleMousemove = (event: MouseEvent) => {
    // 鼠标在控制器上时不隐藏控制器
    if (controlsContainerRef.value && controlsContainerRef.value.contains(event.target as Node)) {
        controlsHidden.value = false
        if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
        return
    }

    // 鼠标移动时显示控制器
    controlsHidden.value = false
    if (hideControlsTimeout) clearTimeout(hideControlsTimeout)

    // 不移动 2s 后隐藏控制器
    hideControlsTimeout = setTimeout(() => {
        controlsHidden.value = true
    }, 2000)
}

// 鼠标进入事件
const handleMouseenter = (event: MouseEvent) => {
    // 鼠标在控制器上时不隐藏控制器
    if (controlsContainerRef.value && controlsContainerRef.value.contains(event.target as Node)) {
        controlsHidden.value = false
        if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
        return
    }
    controlsHidden.value = false
}

// 鼠标离开事件
const handleMouseleave = (event: MouseEvent) => {
    // 鼠标在控制器上时不隐藏控制器
    if (controlsContainerRef.value && controlsContainerRef.value.contains(event.target as Node)) {
        controlsHidden.value = false

        // 不移动 2s 后隐藏控制器
        if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
        return
    }
    controlsHidden.value = true
}


// 根据 size 设置 video 容器的宽高
watchEffect(() => {
    if (videoContainerRef.value) {
        videoContainerRef.value.style.width = size.value.width + 'px'
        videoContainerRef.value.style.height = size.value.height + 'px'
    }
})


// 进入全屏 调整 video 元素的宽高
const adjustSizeFullscreen = () => {
    if (videoRef.value) {
        videoRef.value.style.width = '100%'
        videoRef.value.style.height = '100%'
    }
}

// 进入网页全屏 调整 video 元素的宽高
const adjustSizeWebFullscreen = () => {
    if (videoContainerRef.value && videoRef.value) {
        videoRef.value.style.width = '100vw'
        videoRef.value.style.height = '100vh'
        videoContainerRef.value.style.width = '100vw'
        videoContainerRef.value.style.height = '100vh'
    }
}

// 通用退出全屏 调整 video 元素的宽高
const adjustSizeExitFullscreen = () => {
    if (videoContainerRef.value && videoRef.value) {
        videoRef.value.style.width = size.value.width + 'px'
        videoRef.value.style.height = size.value.height + 'px'
        videoContainerRef.value.style.width = size.value.width + 'px'
        videoContainerRef.value.style.height = size.value.height + 'px'
    }
}


// 处理全屏变化
const handleFullscreenChange = () => {
    if (screenfull.isEnabled) {
        // 更新 store 中的全屏状态
        playerStore.setIsFullScreen(screenfull.isFullscreen)

        // 根据全屏状态调整 video 元素的宽高
        if (screenfull.isFullscreen) {
            adjustSizeFullscreen()
        } else {
            adjustSizeExitFullscreen()
        }
    }
}

// 处理退出全屏
const handleExitFullscreen = async () => {
    if (screenfull.isEnabled && screenfull.isFullscreen) {
        await screenfull.exit()
    }
}

// 监控是否全屏状态
watchEffect(() => {

    // 获取屏幕方向对象，断言为 any 类型
    const orientation = screen.orientation as any

    if (isFullScreen.value) {
        if (videoContainerRef.value && videoRef.value) {
            if (screenfull.isEnabled) {
                adjustSizeFullscreen()
                screenfull.request(videoContainerRef.value);
            }

            // 移动端时 锁定屏幕方向为横屏
            if (isMobile.value && isMobile && typeof orientation.lock === 'function') {
                orientation.lock('landscape').catch((err: any) => {
                    console.error('屏幕方向锁定失败:', err)
                    // 弹窗提示用户手动调整屏幕方向
                    // ElMessage({
                    //     type: MsgType.warning,
                    //     message: '请手动调整屏幕方向为横屏',
                    // })
                })
            }

        }
    } else {
        // 退出全屏
        handleExitFullscreen()

        // 解锁屏幕方向
        if (orientation && typeof orientation.unlock === 'function') orientation.unlock()
    }

})

// 处理屏幕方向变化
const handleOrientationChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
        // 横屏
        if (videoContainerRef.value && videoRef.value) {
            if (screenfull.isEnabled) {
                screenfull.request(videoContainerRef.value);
            }
        }

    } else {
        // 竖屏
        handleExitFullscreen()
    }
}


// 监控网页全屏状态
watchEffect(() => {
    if (isWebFullScreen.value) {
        adjustSizeWebFullscreen()
    } else {
        adjustSizeExitFullscreen()
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

// 根据 playStatus 控制 video 播放暂停
watchEffect(() => {
    if (videoRef.value) playStatus.value === PlayStatus.PLAYING ? videoRef.value.play() : videoRef.value.pause()
})

// 视频加载完成
const handleLoadedmetadata = () => {
    if (videoRef.value) {
        handleProgressbuffered()
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

        // 更新缓存进度
        if (!playProgress.value.isDragging) {
            handleProgressbuffered()
        }
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



// load hls
const loadHls = () => {
    if (Hls.isSupported()) {

        // 创建 hls 实例及配置
        const hls = new Hls({
            loader: CustomLoader,
            maxMaxBufferLength: 10, // 最大缓冲时间（秒）
            maxBufferLength: 10,    // 缓冲时间（秒）
            maxBufferSize: 2 * 1024 * 1024, // 缓冲大小（字节），假设每个分片大小约为1MB
            maxBufferHole: 0.5,     // 最大缓冲空洞（秒）
        })


        // 加载视频源
        hls.loadSource(src.value)

        // 绑定 video 元素
        hls.attachMedia(videoRef.value!)

        // 当清单解析完成时
        hls.on(Hls.Events.MANIFEST_PARSED, () => {

            // 历遍 hls.levels 获取清晰度信息, 保存到 store 中
            const localLevels: Record<string, number> = {}
            hls.levels.forEach((level) => {
                localLevels[getVideoQualityLabel(level.height)] = level.height
            })

            // 更新 store 中的清晰度信息
            playerStore.setPlayLevelAllLevels(localLevels)
        })

        // 获取当前播放清晰度
        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
            var currentLevel = hls.levels[data.level];
            const selectedLevel = getVideoQualityLabel(currentLevel.height)
            playerStore.setSelectedPlayLevel(selectedLevel as PlayLevelLabel)
            // TODO 切换清晰度时, 显示提示信息
        })

        // 监听用户选择清晰度的变化
        watchEffect(() => {
            const levels = hls.levels
            if (levels) {
                const levelIndex = levels.findIndex(level => getVideoQualityLabel(level.height) === playLevel.value.level)
                if (levelIndex !== -1) {
                    hls.currentLevel = levelIndex
                }
            }
        })

    } else {
        console.error('Hls is not supported')
    }
}


onMounted(async () => {

    // 判断是否使用 HLS
    if (mediaType.value === MediaTypes.HLS) { loadHls() }

    if (videoRef.value) {
        handleLoadedmetadata()
        // 监听屏幕方向变化
        const mediaQueryList = window.matchMedia("(orientation: landscape)")
        mediaQueryList.addEventListener('change', handleOrientationChange)
    }

})


onBeforeUnmount(() => {
    // 移除屏幕方向变化监听
    const mediaQueryList = window.matchMedia("(orientation: landscape)")
    mediaQueryList.removeEventListener('change', handleOrientationChange)

})

</script>

<style scoped lang="scss">
// 禁用 video 默认控制器
video::-webkit-media-controls {
    display: none !important;
}

video::-webkit-media-controls-enclosure {
    display: none !important;
}


.video-container {
    position: relative;
    background-color: red;

    video {
        object-fit: contain;
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
        z-index: 3;
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

    // 播放暂停页面占位元素
    %play-paused-page {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        // 内部元素垂直水平居中
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        z-index: 2;

        .iconfont {
            font-size: 100px;
            fill: rgba(0, 0, 0, 0.5);
            transition: fill 0.3s ease;
        }
    }

    .play-button-page {
        @extend %play-paused-page;
        // 背景颜色从中心向四周扩散
        background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.0));
        z-index: 2;
    }

    .play-to-paused-page {
        @extend %play-paused-page;
        // 透明背景
        background-color: rgba(0, 0, 0, 0);
        z-index: 2;
    }
}

@include respond-to('phone') {
    .video-container {
        max-width: phone.$width-video-main;
        max-height: phone.$height-video-main;
    }

    video {
        max-width: phone.$width-video-main;
        max-height: phone.$height-video-main;
    }

    .video-container[data-preview="wechat"] {
        max-width: phone.$width-video-main;
        max-height: phone.$height-video-main;
        width: 100%;
    }
}

@include respond-to('pad') {
    .video-container {
        max-width: phone.$width-video-main;
        max-height: phone.$height-video-main;
    }

    .video-container[data-preview="wechat"] {
        max-width: phone.$width-video-main;
        max-height: phone.$height-video-main;
        width: 100%;
    }
}

@include respond-to('pc') {
    .video-container {
        width: pc.$width-video-main;
    }

    .video-container[data-preview="wechat"] {
        width: 390px;
    }
}
</style>