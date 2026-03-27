<!--
 * @FilePath     : \blog-client\src\components\player\index.vue
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved. 
 * @Description  : 视频播放器
-->

<template>
    <div
        ref="videoContainerRef"
        class="video-container"
        :class="{ 'web-full-screen': localPlayerState.isWebFullScreen }"
        :style="videoContainerWH"
        @fullscreenchange="handleFullscreenChange"
        @mousemove="handleMousemove"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
    >
        <VideoWatermark :text-watermark="localPlayerState.textWatermark" :logo-watermark="localPlayerState.logoWatermark">
            <!-- video元素不使用默认的  controls-->
            <video
                class="my-video"
                :class="{ 'my-video-web-full-screen': localPlayerState.isWebFullScreen }"
                ref="videoRef"
                :key="`${localPlayerState.postId}-${localPlayerState.videoID}`"
                :src="localPlayerState.src"
                :poster="localPlayerState.poster"
                @timeupdate="handleTimeupdate"
                @loadedmetadata="handleLoadedmetadata"
                @progress="handleProgress"
                @ended="handleEnded"
                @waiting="handleWaiting"
                @canplay="handleCanplay"
                playsinline
                webkit-playsinline
                x5-video-player-type="h5"
                x5-video-player-fullscreen="true"
            >
                <!-- <track v-if="isShowSubtitles" src="http://10.10.2.222:5426/api/v1/uploads/cn.vtt" kind="subtitles" srclang="cn" label="中文" default /> -->
                <track v-if="isShowSubtitles" default :src="subtitlesSrc" kind="subtitles" :srclang="srclang" :label="subtitlesLabel" />

                您的浏览器不支持 video 标签。请使用最新版本的 Chrome 浏览器观看视频。
            </video>

            <!-- 视频控制器 -->
            <div
                ref="controlsContainerRef"
                class="controls-container"
                :class="{ hidden: controlsHidden }"
                @mouseenter="handleMouseenter"
                @mouseleave="handleMouseleave"
            >
                <Controls
                    class="controls"
                    :el-popover-append-to-element="videoContainerRef"
                    :player-state="localPlayerState"
                    @update-status="updatePlayerByControls"
                />
            </div>

            <!-- 用户自定义的目录插槽 -->
            <slot name="toc"></slot>
        </VideoWatermark>

        <!-- 播放按钮遮罩 -->
        <div v-if="showPlayButton" class="play-button-page" @click="togglePlayPause" @dblclick="handleDblclick">
            <j-icon v-show="!showLoader" :name="IconKeys.Play" custom-class="iconfont" />
            <div v-show="showLoader" class="loader"></div>
        </div>

        <!-- 从播放状态到暂停的透明遮罩 -->
        <div v-if="!showPlayButton" class="play-to-paused-page" :class="{ hidden: controlsHidden }" @click="togglePlayPause" @dblclick="handleDblclick"></div>

        <!-- 错误信息遮罩 -->
        <div v-if="localPlayerState.showError" class="show-error">
            <span class="show-error-text">{{ localPlayerState.errMsg }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from "@vueuse/core"
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, useTemplateRef, watch } from "vue"

import { IconKeys } from "@/components/common/icons"
import JIcon from "@/components/common/icons"
import Controls from "@/components/player/components/controls"
import VideoWatermark from "@/components/player/components/watermark"
import { setCustomStyle } from "@/utils/style"

import { useFullscreen } from "./hooks/fullScreen"
import { useHls } from "./hooks/hls"
import { useMouse } from "./hooks/mouse"
import { useProgress } from "./hooks/progress"
import { useSubtitles } from "./hooks/subtitles"
import { PlayerStateManager } from "./state"
import { MediaTypes, type PlayerState, PlayStatus } from "./types"
import { getVideoQualityLabel } from "./utils"

defineOptions({ name: "VideoPlayer" })

// 定义props
const { playerState } = defineProps<{
    playerState: PlayerState // 播放器状态
}>()

// 初始化播放器状态管理器
const localManager = new PlayerStateManager(playerState)
const localPlayerState = reactive(localManager.getState())

// 通过控制器更新播放器状态
const updatePlayerByControls = (playerProps: PlayerState) => {
    localManager.updateState(playerProps)
}

// 根据当前环境更新 isMobile
localManager.setIsMobile(/mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

// 判断是否是 iphone
localManager.setIsIphone(/iPhone/i.test(navigator.userAgent))

// 定义 video 元素的 ref
const videoContainerRef = useTemplateRef<HTMLElement | null>("videoContainerRef")
const videoRef = useTemplateRef<HTMLVideoElement | null>("videoRef")
const controlsContainerRef = useTemplateRef<HTMLElement | null>("controlsContainerRef")

// 状态
const showPlayButton = computed(() => localPlayerState.playStatus !== PlayStatus.PLAYING)
const showLoader = computed(() => localPlayerState.playStatus === PlayStatus.BUFFERING)
const { queueSeekTime, syncPendingSeekTime, updateStateByVideo } = useProgress(videoRef, localManager, localPlayerState)

// 切换播放暂停
const togglePlayPause = () => {
    localManager.togglePlayPause()
}

// 处理视频页面双击事件
const handleDblclick = () => {
    // 判断是否是网页全屏
    if (localPlayerState.isWebFullScreen) {
        localManager.toggleWebFullScreen()
        return
    }

    // 判断是否是画中画
    if (localPlayerState.isPictureInPicture) {
        localManager.togglePictureInPicture()
        return
    }

    // 判断是否是全屏
    localManager.toggleFullScreen()
}

// 处理视频进度
const handleProgress = () => {
    handleProgressBuffered()
}

/**
 * 获取方向媒体查询列表
 * @returns {MediaQueryList|null} 返回横屏方向的媒体查询列表，如果环境不支持则返回 null
 */
const getOrientationMediaQueryList = (): MediaQueryList | null => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return null
    }

    return window.matchMedia("(orientation: landscape)")
}

// 视频播放结束
const handleEnded = () => {
    localManager.end()
}

// 视频缓冲事件
const handleWaiting = () => {
    // 如果是播放状态, 则缓冲,否则保持原状态
    if (localPlayerState.playStatus === PlayStatus.PLAYING) {
        localManager.buffering()
    }
}

// 处理可以播放事件
const handleCanplay = () => {
    syncPendingSeekTime()

    // 如果是缓冲状态, 则播放,否则保持原状态
    if (localPlayerState.playStatus === PlayStatus.BUFFERING) {
        localManager.play()
    }
}

// 处理缓存进度
const handleProgressBuffered = () => {
    if (videoRef.value) {
        const buffered = videoRef.value.buffered
        if (buffered.length > 0) {
            const bufferedEnd = buffered.end(buffered.length - 1)
            localManager.setBuffered(bufferedEnd)
        }
    }
}

// 根据 size 设置 video 容器的宽高
const videoContainerWH = computed(() => {
    const size = localPlayerState.size
    return {
        "--video-container-width": size.width + "px",
        "--video-container-height": size.height + "px",
    }
})

// 使用字幕 hook
const { isShowSubtitles, subtitlesSrc, srclang, subtitlesLabel } = useSubtitles(localPlayerState)

// 更新字幕字体大小
const updateCueFontSize = () => {
    if (videoRef.value) {
        const width = videoRef.value.clientWidth
        let fontSize = "16px" // 默认字体大小

        if (width <= 600) {
            fontSize = "16px"
        } else if (width > 600 && width <= 1200) {
            fontSize = "24px"
        } else if (width > 1200) {
            fontSize = "60px"
        }

        const videoCue = `
video::cue {
    font-size: ${fontSize};
}
`
        setCustomStyle("video-cue-style", videoCue)
    }
}

// 监控 video 元素的宽度, 设置 ::cue 的字体大小
useResizeObserver(videoContainerRef, () => {
    // const entry = entries[0]
    // const { width, height } = entry.contentRect
    // console.log(`尺寸变化了 width: ${width}, height: ${height}`)
    updateCueFontSize()
})

const { handleFullscreenChange, handleOrientationChange } = useFullscreen(videoContainerRef, videoRef, localManager, localPlayerState)

const { controlsHidden, handleMousemove, handleMouseenter, handleMouseleave } = useMouse(controlsContainerRef, localManager)

// 监控画中画状态
watch(
    () => localPlayerState.isPictureInPicture,
    (isPictureInPicture) => {
        if (videoRef.value && isPictureInPicture) {
            videoRef.value.requestPictureInPicture()
        }
        if (!isPictureInPicture && document.pictureInPictureElement) {
            document.exitPictureInPicture()
        }
    },
)

// 根据 playStatus 控制 video 播放暂停
watch(
    () => localPlayerState.playStatus,
    (playStatus) => {
        if (videoRef.value) {
            if (playStatus === PlayStatus.PLAYING) {
                videoRef.value.play()
            } else {
                videoRef.value.pause()
            }
        }
    },
)

// 视频加载完成
const handleLoadedmetadata = () => {
    if (videoRef.value) {
        handleProgressBuffered()
        updateStateByVideo()
    }
}

// 监听 video 元素的 timeupdate 事件
const handleTimeupdate = () => {
    if (localPlayerState.isUserInput || localPlayerState.playProgress.isDragging) return
    if (videoRef.value) {
        localManager.setUserInput(false)
        localManager.setCurrentTime(videoRef.value.currentTime)
    }
}

// 监听用户输入进度变化
watch(
    () => localPlayerState.isUserInput,
    (isUserInput) => {
        if (!isUserInput) return

        queueSeekTime(localPlayerState.playProgress.currentTime)

        if (syncPendingSeekTime() && !localPlayerState.playProgress.isDragging) {
            handleProgressBuffered()
        }
    },
)

// 监控音量变化
watch(
    () => localPlayerState.volume.volume,
    (volume) => {
        if (videoRef.value) videoRef.value.volume = volume / 100
    },
)

// 监控播放速度变化
watch(
    () => localPlayerState.playbackRate,
    (playbackRate) => {
        if (videoRef.value) videoRef.value.playbackRate = playbackRate
    },
)

// 监控是否循环播放
watch(
    () => localPlayerState.isLoop,
    (isLoop) => {
        if (videoRef.value) videoRef.value.loop = isLoop
    },
)

// 使用 hls hook
const { hls, destroyHls, loadHls } = useHls(videoRef, localManager, localPlayerState)

// 监听用户选择清晰度的变化
watch(
    () => localPlayerState.playLevel.level,
    (newVal) => {
        if (!hls.value) return
        const levels = hls.value.levels
        if (levels) {
            const levelIndex = levels.findIndex((level) => {
                return getVideoQualityLabel(level.height) === newVal
            })

            if (levelIndex !== -1 && hls.value) {
                hls.value.currentLevel = levelIndex
            }
        }
    },
    { immediate: true },
)

// 监听是否为 iphone, 如果是 iphone 则将 poster 设置为空
watch(
    () => localPlayerState.isIphone,
    (isIphone) => {
        if (isIphone) {
            localManager.setPoster("")
        }
    },
)

// 更新视频
const updateVideo = () => {
    // 判断视频类型
    if (localPlayerState.mediaType === MediaTypes.HLS) {
        loadHls()
    }

    // 非 hls
    if ([MediaTypes.MP4, MediaTypes.WEBM].includes(localPlayerState.mediaType)) {
        handleLoadedmetadata()
    }

    // 监听屏幕方向变化
    if (videoRef.value) {
        const mediaQueryList = getOrientationMediaQueryList()
        if (!mediaQueryList) return

        mediaQueryList.addEventListener("change", handleOrientationChange)
    }
}

// TODO 后续观察是否需要监听 src 变化

// 监听 src 变化
watch(
    () => [localPlayerState.videoID, videoRef.value],
    async ([videoID, videoEl]) => {
        // 只有在 videoID 和 videoRef 都准备好时才执行
        if (videoID && videoEl) {
            queueSeekTime(localPlayerState.playProgress.currentTime)
            localManager.setSubtitlesByVideoHashIdAuto()
            updateVideo()
            await nextTick()
            syncPendingSeekTime()
        }
    },
    { immediate: true },
)

onMounted(() => {
    // 初始化字幕字体大小
    updateCueFontSize()
})

onBeforeUnmount(() => {
    // 移除屏幕方向变化监听
    const mediaQueryList = getOrientationMediaQueryList()
    if (mediaQueryList) {
        mediaQueryList.removeEventListener("change", handleOrientationChange)
    }

    // 销毁 state 管理器
    localManager.destroy()

    // 显式销毁 hls
    destroyHls()
})
</script>

<style lang="scss">
@use "./style.module.scss";
</style>
