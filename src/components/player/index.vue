<!--
 * FilePath    : blog-client-nuxt\src\components\player\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频播放器
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
            <!-- video 元素不使用默认的 controls -->
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
                <track
                    v-if="isShowSubtitles"
                    default
                    :src="subtitlesSrc"
                    kind="subtitles"
                    :srclang="srclang"
                    :label="subtitlesLabel"
                    @load="handleSubtitlesLoad"
                />

                您的浏览器不支持 video 标签。请使用最新版本的 Chrome 浏览器观看视频。
            </video>

            <div v-if="!localPlayerState.isPictureInPicture && activeSubtitleCues.length > 0" class="custom-subtitles" aria-hidden="true">
                <span
                    v-for="cue in activeSubtitleCues"
                    :key="`${cue.startTime}-${cue.endTime}-${cue.text}`"
                    v-stable-html="getSubtitleCueHtml(cue)"
                    class="custom-subtitle-cue"
                    :style="getSubtitleCueStyle(cue)"
                ></span>
            </div>

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
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef, useTemplateRef, watch } from "vue"

import { IconKeys } from "@/components/common/icons"
import JIcon from "@/components/common/icons"
import Controls from "@/components/player/components/controls"
import VideoWatermark from "@/components/player/components/watermark"
import { useUserStore } from "@/stores/user"

import { useFullscreen } from "./hooks/fullScreen"
import { useHls } from "./hooks/hls"
import { useMouse } from "./hooks/mouse"
import { useProgress } from "./hooks/progress"
import { applyDefaultSubtitleCueSettings, getSubtitleCueStyle, useSubtitles } from "./hooks/subtitles"
import { PlayerStateManager } from "./state"
import { MediaTypes, type PlayerState, PlayStatus } from "./types"
import { getVideoQualityLabel } from "./utils"

defineOptions({ name: "VideoPlayer" })

const { playerState } = defineProps<{
    playerState: PlayerState
}>()

const localManager = new PlayerStateManager(playerState)
const localPlayerState = reactive(localManager.getState())

const updatePlayerByControls = (playerProps: PlayerState) => {
    localManager.updateState(playerProps)
}

// 根据当前环境更新 isMobile
localManager.setIsMobile(/mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

localManager.setIsIphone(/iPhone/i.test(navigator.userAgent))

const videoContainerRef = useTemplateRef<HTMLElement | null>("videoContainerRef")
const videoRef = useTemplateRef<HTMLVideoElement | null>("videoRef")
const controlsContainerRef = useTemplateRef<HTMLElement | null>("controlsContainerRef")

const showPlayButton = computed(() => localPlayerState.playStatus !== PlayStatus.PLAYING)
const showLoader = computed(() => localPlayerState.playStatus === PlayStatus.BUFFERING)
const { queueSeekTime, syncPendingSeekTime, updateStateByVideo } = useProgress(videoRef, localManager, localPlayerState)

const togglePlayPause = () => {
    localManager.togglePlayPause()
}

const handleDblclick = () => {
    if (localPlayerState.isWebFullScreen) {
        localManager.toggleWebFullScreen()
        return
    }

    if (localPlayerState.isPictureInPicture) {
        localManager.togglePictureInPicture()
        return
    }

    localManager.toggleFullScreen()
}

const handleProgress = () => {
    handleProgressBuffered()
}

/**
 * 获取方向媒体查询列表
 * @returns {MediaQueryList|null} 返回横屏方向的媒体查询列表, 如果环境不支持则返回 null
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
    // 如果是播放状态, 则缓冲, 否则保持原状态
    if (localPlayerState.playStatus === PlayStatus.PLAYING) {
        localManager.buffering()
    }
}

// 处理可以播放事件
const handleCanplay = () => {
    syncPendingSeekTime()

    // 如果是缓冲状态, 则播放, 否则保持原状态
    if (localPlayerState.playStatus === PlayStatus.BUFFERING) {
        localManager.play()
    }
}

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
        "--video-subtitle-font-size": subtitleFontSize.value,
    }
})

const { isShowSubtitles, subtitlesSrc, srclang, subtitlesLabel } = useSubtitles(localPlayerState)
const activeSubtitleCues = shallowRef<VTTCue[]>([])
const subtitleFontSize = ref("16px")
let subtitleTextTrack: TextTrack | null = null

/**
 * 同步当前正在显示的 WebVTT cue, 为自定义字幕覆盖层提供内容.
 * @returns 无返回值.
 */
const syncActiveSubtitleCues = (): void => {
    if (!subtitleTextTrack?.activeCues) {
        activeSubtitleCues.value = []
        return
    }

    activeSubtitleCues.value = Array.from(subtitleTextTrack.activeCues).filter((cue): cue is VTTCue => "text" in cue)
}

/**
 * 解除当前字幕轨道事件监听, 避免切换字幕语言后残留旧轨道回调.
 * @returns 无返回值.
 */
const detachSubtitleTrack = (): void => {
    subtitleTextTrack?.removeEventListener("cuechange", syncActiveSubtitleCues)
    subtitleTextTrack = null
    activeSubtitleCues.value = []
}

watch(
    () => localPlayerState.subtitles.selectedSubtitlesLanguage,
    () => detachSubtitleTrack(),
)

/**
 * 在字幕轨道加载完成后应用默认 cue 布局, 字幕文件已有的自定义布局保持不变.
 * @param event 字幕 track 元素触发的加载事件.
 * @returns 无返回值.
 */
const handleSubtitlesLoad = (event: Event): void => {
    const trackElement = event.currentTarget
    if (!(trackElement instanceof HTMLTrackElement)) return

    detachSubtitleTrack()
    subtitleTextTrack = trackElement.track
    applyDefaultSubtitleCueSettings(trackElement.track)
    trackElement.track.mode = localPlayerState.isPictureInPicture ? "showing" : "hidden"
    trackElement.track.addEventListener("cuechange", syncActiveSubtitleCues)
    syncActiveSubtitleCues()
}

/**
 * 将浏览器解析后的 WebVTT cue 内容转换为安全的 HTML 字符串, 保留粗体和斜体等内联标记.
 * @param cue 当前需要渲染的 WebVTT cue.
 * @returns 由浏览器 WebVTT 解析器生成的 HTML 字符串.
 */
const getSubtitleCueHtml = (cue: VTTCue): string => {
    const container = document.createElement("span")
    container.append(cue.getCueAsHTML())
    return container.innerHTML
}

const updateCueFontSize = () => {
    if (videoRef.value) {
        const width = videoRef.value.clientWidth
        let fontSize = "16px"

        if (width <= 600) {
            fontSize = "16px"
        } else if (width > 600 && width <= 1200) {
            fontSize = "24px"
        } else if (width > 1200) {
            fontSize = "60px"
        }

        subtitleFontSize.value = fontSize
    }
}

// 监控 video 元素的宽度, 设置 ::cue 的字体大小
useResizeObserver(videoContainerRef, () => {
    updateCueFontSize()
})

const { handleFullscreenChange, handleOrientationChange } = useFullscreen(videoContainerRef, videoRef, localManager, localPlayerState)

const { controlsHidden, handleMousemove, handleMouseenter, handleMouseleave } = useMouse(controlsContainerRef, localManager)

watch(
    () => localPlayerState.isPictureInPicture,
    (isPictureInPicture) => {
        if (subtitleTextTrack) {
            subtitleTextTrack.mode = isPictureInPicture ? "showing" : "hidden"
            syncActiveSubtitleCues()
        }

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

watch(
    () => localPlayerState.volume.volume,
    (volume) => {
        if (videoRef.value) videoRef.value.volume = volume / 100
    },
)

watch(
    () => localPlayerState.playbackRate,
    (playbackRate) => {
        if (videoRef.value) videoRef.value.playbackRate = playbackRate
    },
)

watch(
    () => localPlayerState.isLoop,
    (isLoop) => {
        if (videoRef.value) videoRef.value.loop = isLoop
    },
)

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

const updateVideo = () => {
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

// Nuxt 适配: 公开文章页 SSR 水合不阻塞渲染, 视频播放器可能先于 initStores 的登录恢复挂载,
// 首次 HLS 请求无 token 会被后端拒绝并显示"请登录后观看视频"; 登录恢复(accessToken 由空变非空)后
// 清除错误提示并重载视频, 与 SPA 中间件阻塞首帧后的登录态时序保持一致.
const userStore = useUserStore()
watch(
    () => userStore.accessToken,
    (token, prevToken) => {
        // 仅在登录恢复(空 → 非空)且已有视频源时重载; token 轮换与退出登录不触发重载
        if (!token || prevToken || !localPlayerState.videoID) {
            return
        }

        localManager.setShowError(false)
        localManager.setErrMsg("")
        updateVideo()
    },
)

onMounted(() => {
    updateCueFontSize()
})

onBeforeUnmount(() => {
    // 移除屏幕方向变化监听
    const mediaQueryList = getOrientationMediaQueryList()
    if (mediaQueryList) {
        mediaQueryList.removeEventListener("change", handleOrientationChange)
    }

    detachSubtitleTrack()

    localManager.destroy()

    destroyHls()
})
</script>

<style lang="scss">
@use "./style.module.scss";
</style>
