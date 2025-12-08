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
        @fullscreenchange="handleFullscreenChange"
        @mousemove="handleMousemove"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
    >
        <VideoWatermark :text-watermark="localPlayerState.textWatermark" :logo-watermark="localPlayerState.logoWatermark">
            <!-- video元素不使用默认的  controls-->
            <video
                class="my-video"
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
                <!-- <track v-if="isShowSubtitles" src="http://10.10.2.222:8081/api/v1/uploads/cn.vtt" kind="subtitles" srclang="cn" label="中文" default /> -->
                <track v-if="isShowSubtitles" :src="subtitlesSrc" kind="subtitles" :srclang="srclang" :label="subtitlesLabel" default />

                您的浏览器不支持 video 标签。请使用最新版本的 Chrome 浏览器观看视频。
            </video>

            <!-- 视频控制器 -->
            <div
                ref="controlsContainerRef"
                class="controls-Container"
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
import Hls, { type ErrorData } from "hls.js"
import screenfull from "screenfull"
import { computed, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef, watch } from "vue"

import { ResponseCode } from "@/api/response"
import { IconKeys } from "@/components/common/icons"
import JIcon from "@/components/common/icons"
import Controls from "@/components/player/components/controls"
import VideoWatermark from "@/components/player/components/watermark"
import { createCustomLoaderClass } from "@/pkg/hls"

import { PlayerStateManager } from "./state"
import { DisabledSubtitles, type LanguageKey, MediaTypes, type PlayerSize, type PlayerState, type PlayLevelLabel, PlayStatus } from "./types"
import { getVideoQualityLabel } from "./utils"

defineOptions({ name: "VideoPlayer" })

// 定义props
const { playerState } = defineProps<{
    playerState: PlayerState // 播放器状态
}>()

// 初始化播放器状态管理器
const localManager = new PlayerStateManager(playerState)
const localPlayerState = reactive(localManager.getState())

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

// 是否显示字幕选择
const isShowSubtitles = computed(() => {
    if (localPlayerState.subtitles && localPlayerState.subtitles.selectedSubtitlesLanguage) {
        // 判断 subtitles.value.selectedSubtitlesLanguage 是否在 DisabledSubtitles keys 中, 如果在则不显示字幕, 否则显示字幕
        return !Object.keys(DisabledSubtitles).includes(localPlayerState.subtitles.selectedSubtitlesLanguage as LanguageKey)
    }
    return false
})

// 字幕 src
const subtitlesSrc = computed(() => {
    if (localPlayerState.subtitles && localPlayerState.subtitles.availableSubtitles && localPlayerState.subtitles.selectedSubtitlesLanguage) {
        const availableSubtitles = {
            ...DisabledSubtitles, // 确保不会出现 undefined
            ...localPlayerState.subtitles.availableSubtitles,
        }
        const selectedSubtitle = availableSubtitles[localPlayerState.subtitles.selectedSubtitlesLanguage as LanguageKey]
        return selectedSubtitle ? selectedSubtitle.src : ""
    }
    return ""
})

// 字幕语言
const srclang = computed(() => {
    if (localPlayerState.subtitles && localPlayerState.subtitles.selectedSubtitlesLanguage) {
        return localPlayerState.subtitles.selectedSubtitlesLanguage
    }
    return ""
})

// 字幕 label
const subtitlesLabel = computed(() => {
    if (localPlayerState.subtitles && localPlayerState.subtitles.availableSubtitles && localPlayerState.subtitles.selectedSubtitlesLanguage) {
        const availableSubtitles = {
            ...DisabledSubtitles,
            ...localPlayerState.subtitles.availableSubtitles,
        }
        const selectedSubtitle = availableSubtitles[localPlayerState.subtitles.selectedSubtitlesLanguage as LanguageKey]
        return selectedSubtitle ? selectedSubtitle.label : ""
    }
    return ""
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

    // 不移动 3s 后隐藏控制器
    hideControlsTimeout = setTimeout(() => {
        controlsHidden.value = true
    }, 3000)
}

// 鼠标进入事件
const handleMouseenter = (event: MouseEvent) => {
    // 开启快捷键监听
    localManager.setShortcutKey(true)

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
    // 关闭快捷键监听
    localManager.setShortcutKey(false)

    // 鼠标在控制器上时不隐藏控制器
    if (controlsContainerRef.value && controlsContainerRef.value.contains(event.target as Node)) {
        controlsHidden.value = false

        // 不移动 2s 后隐藏控制器
        if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
        return
    }
    controlsHidden.value = true
}

// 进入全屏 调整 video 元素的宽高
const initSize = (size: PlayerSize) => {
    if (videoContainerRef.value) {
        videoContainerRef.value.style.width = size.width + "px"
        videoContainerRef.value.style.height = size.height + "px"
    }
}

// 根据 size 设置 video 容器的宽高
watch(
    () => localPlayerState.size,
    (newSize) => {
        initSize(newSize)
    },
)

// 进入全屏 调整 video 元素的宽高
const adjustSizeFullscreen = () => {
    if (videoRef.value) {
        videoRef.value.style.width = "100%"
        videoRef.value.style.height = "100%"
    }
}

// 进入网页全屏 调整 video 元素的宽高
const adjustSizeWebFullscreen = () => {
    if (videoContainerRef.value && videoRef.value) {
        videoRef.value.style.width = "100vw"
        videoRef.value.style.height = "100vh"
        videoContainerRef.value.style.width = "100vw"
        videoContainerRef.value.style.height = "100vh"
    }
}

// 通用退出全屏 调整 video 元素的宽高
const adjustSizeExitFullscreen = () => {
    if (videoContainerRef.value && videoRef.value) {
        videoRef.value.style.width = localPlayerState.size.width + "px"
        videoRef.value.style.height = localPlayerState.size.height + "px"
        videoContainerRef.value.style.width = localPlayerState.size.width + "px"
        videoContainerRef.value.style.height = localPlayerState.size.height + "px"
    }
}

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

        const style = document.createElement("style")
        style.innerHTML = `
      ::cue {
        font-size: ${fontSize};
      }
    `
        document.head.appendChild(style)
    }
}

// 监控 video 元素的宽度,设置 ::cue 的字体大小
useResizeObserver(videoContainerRef, () => {
    // const entry = entries[0]
    // const { width, height } = entry.contentRect
    // console.log(`尺寸变化了 width: ${width}, height: ${height}`)
    updateCueFontSize()
})

// 处理全屏变化
const handleFullscreenChange = () => {
    if (screenfull.isEnabled) {
        // 更新 store 中的全屏状态
        localManager.setIsFullScreen(screenfull.isFullscreen)

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
watch(
    () => localPlayerState.isFullScreen,
    (isFullScreen) => {
        // 获取屏幕方向对象，断言为 any 类型
        const orientation = screen.orientation as ScreenOrientation

        if (isFullScreen) {
            if (videoContainerRef.value && videoRef.value) {
                if (screenfull.isEnabled) {
                    adjustSizeFullscreen()
                    screenfull.request(videoContainerRef.value)
                }

                if (localPlayerState.isIphone) {
                    // 主要是 iOS 手机，不支持全屏时，提示用户手动调整屏幕方向
                    // ElMessage({
                    //     type: MsgType.warning,
                    //     message: 'iOS 不支持全屏, 请手动调整屏幕方向为横屏.',
                    // })

                    // Safari for iOS
                    const videoElement = videoRef.value as HTMLVideoElement & {
                        webkitEnterFullscreen?: () => void
                    }
                    if (videoElement.webkitEnterFullscreen) {
                        videoElement.webkitEnterFullscreen()
                        localManager.setIsFullScreen(false) // 只要进入全屏，就设置为 false,退出后也是false
                    }
                }

                // // 移动端时 锁定屏幕方向为横屏
                // if (localPlayerState.isMobile && typeof orientation.lock === "function") {
                //     orientation.lock("landscape").catch((err: unknown) => {
                //         console.log("屏幕方向锁定失败:", err)
                //         // 弹窗提示用户手动调整屏幕方向
                //         // ElMessage({
                //         //     type: MsgType.warning,
                //         //     message: '请手动调整屏幕方向为横屏',
                //         // })
                //     })
                // }
            }
        } else {
            // 退出全屏
            handleExitFullscreen()

            // 解锁屏幕方向
            if (orientation && typeof orientation.unlock === "function") orientation.unlock()
        }
    },
)

// 处理屏幕方向变化
const handleOrientationChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
        // 横屏
        if (videoContainerRef.value && videoRef.value) {
            if (screenfull.isEnabled) {
                screenfull.request(videoContainerRef.value)
            }
        }
    } else {
        // 竖屏
        handleExitFullscreen()
    }
}

// 监控网页全屏状态
watch(
    () => localPlayerState.isWebFullScreen,
    (isWebFullScreen) => {
        if (isWebFullScreen) {
            adjustSizeWebFullscreen()
        } else {
            adjustSizeExitFullscreen()
        }
    },
)

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

// 根据 video 元素更新 state 中的数据
const updateStateByVideo = () => {
    if (videoRef.value) {
        videoRef.value.currentTime = localPlayerState.playProgress.currentTime
        localManager.setDuration(videoRef.value.duration)
        localManager.setPlaybackRate(videoRef.value.playbackRate)
        videoRef.value.loop = localPlayerState.isLoop
        videoRef.value.volume = localPlayerState.volume.volume / 100
        localManager.setUserInput(false)
        localManager.setIsDragging(false)
    }
}

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
        if (videoRef.value) {
            videoRef.value.currentTime = localPlayerState.playProgress.currentTime

            // 更新缓存进度
            if (!localPlayerState.playProgress.isDragging) {
                handleProgressBuffered()
            }
            localManager.setUserInput(false)
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

let hls: Hls | null = null // 将 hls 实例提到外部, 以便销毁

// 显示销毁 hls 实例
const destroyHls = () => {
    if (hls) {
        hls.stopLoad()
        hls.detachMedia()
        hls.destroy()
        hls = null
    }
}

// 加载 hls
const loadHls = () => {
    // 销毁旧的 hls 实例
    destroyHls()

    if (Hls.isSupported()) {
        // 创建 hls 实例及配置
        hls = new Hls({
            loader: createCustomLoaderClass(localPlayerState.isAdmin, localPlayerState.postId),
            maxMaxBufferLength: 10, // 最大缓冲时间(秒)
            maxBufferLength: 10, // 缓冲时间(秒)
            maxBufferSize: 2 * 1024 * 1024, // 缓冲大小(字节), 假设每个分片大小约为1MB
            maxBufferHole: 0.5, // 最大缓冲空洞(秒)
        })

        // 加载视频源
        hls.loadSource(localPlayerState.videoID)

        // 绑定 video 元素
        hls.attachMedia(videoRef.value!)

        // 当解析完成时
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            // 历遍 hls.levels 获取清晰度信息, 保存到 state 中
            const localLevels: Record<string, number> = {}
            hls?.levels.forEach((level) => {
                localLevels[getVideoQualityLabel(level.height)] = level.height
            })

            // 更新 state 中的清晰度信息
            localManager.setPlayLevelAllLevels(localLevels)
        })

        // 获取当前播放清晰度
        hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
            const currentLevel = hls?.levels[data.level]
            const selectedLevel = getVideoQualityLabel(currentLevel?.height || 0)
            localManager.setSelectedPlayLevel(selectedLevel as PlayLevelLabel)
            // TODO 切换清晰度时, 显示提示信息
        })

        // 处理 HLS 错误
        hls.on(Hls.Events.ERROR, function (event, data) {
            // 处理 hls 错误，并判断是否为预期错误
            const isExpectedError = handleHlsError(hls, data)
            if (data.fatal && !isExpectedError) {
                console.error("non-fatal error encountered:", data)
                // 销毁 hls 实例
                destroyHls()
            }
        })
    } else {
        localManager.setShowError(true)
        localManager.setErrMsg("HLS 不支持当前浏览器, 请使用最新版本的 Chrome 浏览器观看视频")
    }
}

// 处理 hls 错误
const handleHlsError = (hls: Hls | null, data: ErrorData): boolean => {
    // 返回是否为预期错误
    let isExpectedError = false

    // 确保 hls 实例和 data.response.code 存在
    if (!hls || !data.response || !data.response.code) {
        return isExpectedError
    }

    // 处理自定义 loader 中的错误

    // 將 data.response.code 转换为 number 类型
    const resCode = parseInt(data.response.code.toString())

    // 成功的 code
    const successCodes = [ResponseCode.GetVideoM3u8Success, ResponseCode.GetVideoMainM3u8Success, ResponseCode.GetVideoKeySuccess]

    // 如果是成功的 code, 则直接返回
    if (successCodes.includes(resCode)) {
        isExpectedError = true
        return isExpectedError
    }

    // 根据错误码展示不同的错误信息
    const errMsgMap: Record<number, string> = {
        [ResponseCode.VideoNotFound]: "视频不存在。",
        [ResponseCode.VideoHasNoPay]: "付费视频未购买；请购买后观看。",
        [ResponseCode.UserAuthorizationEmpty]: "请登录后观看视频。",
        [ResponseCode.UserAuthorizationFormatWrong]: "登录状态异常，请重新登录后观看视频。",
        [ResponseCode.UserTokenInvalid]: "登录状态异常，请重新登录后观看视频。",
        [ResponseCode.UserTokenTypeWrong]: "登录状态异常，请重新登录后观看视频。",
        [ResponseCode.UserTokenExpired]: "登录状态异常，请重新登录后观看视频。",
    }

    // 如果错误码在 errMsgMap 中，直接展示对应的错误信息
    if (errMsgMap.hasOwnProperty(resCode)) {
        const errMsg = errMsgMap[resCode as keyof typeof errMsgMap] || `请求视频资源失败，错误代码: ${data.response.code}，错误信息：${data.response.text}`
        // 展示错误信息
        managerShowError(localManager, errMsg)

        // 销毁 hls 实例
        destroyHls()
        isExpectedError = true
        return isExpectedError
    }

    // 其他错误类型，并根据错误类型尝试恢复
    let errMsg = `请求视频资源失败，错误代码: ${data.response.code}，错误信息：${data.response.text}`

    // 展示错误信息
    managerShowError(localManager, errMsg)

    switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
            // 尝试恢复网络错误
            // console.warn("fatal network error encountered, try to recover")
            hls.startLoad()
            isExpectedError = true
            break
        case Hls.ErrorTypes.MEDIA_ERROR:
            // 尝试恢复媒体错误
            // console.warn("fatal media error encountered, try to recover")
            hls.recoverMediaError()
            isExpectedError = true
            break
        default:
            // 无法恢复的错误
            // console.warn("fatal error encountered, destroy hls instance")
            errMsg = errMsg + ` 播放错误: ${data.details}`
            localManager.setErrMsg(errMsg)
            destroyHls()
            isExpectedError = false
    }
    return isExpectedError
}

// 展示错误在播放器上
const managerShowError = (manager: PlayerStateManager, msg: string) => {
    manager.setShowError(true)
    manager.setErrMsg(msg)
}

// 监听用户选择清晰度的变化
watch(
    () => localPlayerState.playLevel.level,
    (newVal) => {
        if (!hls) return
        const levels = hls.levels
        if (levels) {
            const levelIndex = levels.findIndex((level) => {
                return getVideoQualityLabel(level.height) === newVal
            })

            if (levelIndex !== -1 && hls) {
                hls.currentLevel = levelIndex
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
    if (localPlayerState.mediaType in [MediaTypes.MP4, MediaTypes.WEBM]) {
        handleLoadedmetadata()
    }

    // 监听屏幕方向变化
    if (videoRef.value) {
        const mediaQueryList = window.matchMedia("(orientation: landscape)")
        mediaQueryList.addEventListener("change", handleOrientationChange)
    }
}

// TODO 后续观察是否需要监听 src 变化

// 监听 src 变化
watch(
    () => [localPlayerState.videoID, videoRef.value],
    ([videoID, videoEl]) => {
        // 只有在 videoID 和 videoRef 都准备好时才执行
        if (videoID && videoEl) {
            localManager.setSubtitlesByVideoHashIdAuto()
            updateVideo()
        }
    },
    { immediate: true },
)

onMounted(() => {
    // 初始化尺寸
    initSize(localPlayerState.size)
    // 初始化字幕字体大小
    updateCueFontSize()
})

onBeforeUnmount(() => {
    // 移除屏幕方向变化监听
    const mediaQueryList = window.matchMedia("(orientation: landscape)")
    mediaQueryList.removeEventListener("change", handleOrientationChange)

    // 销毁 state 管理器
    localManager.destroy()

    // 显式销毁 hls
    destroyHls()
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
    background-color: transparent;

    &.web-full-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        padding: 0;
        z-index: 1000;
        background-color: #fff;
    }

    .my-video {
        // background-color: #ddd;
        background-color: transparent;
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
        z-index: 4;
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

    // 绝对定位
    %absolute-all {
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
    }

    // 播放暂停页面占位元素
    %play-paused-page {
        @extend %absolute-all;
        z-index: 2;

        .iconfont {
            font-size: 100px;
            fill: rgba(0, 0, 0, 0.5);
            transition: fill 0.3s ease;
        }

        // @include respond-to("pc") {
        // }

        // @include respond-to("pad") {
        // }

        @include respond-to("phone") {
            .iconfont {
                font-size: 50px;
            }
        }
    }

    .play-button-page {
        @extend %play-paused-page;
        // 背景颜色从中心向四周扩散
        background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
        z-index: 2;
    }

    .play-to-paused-page {
        @extend %play-paused-page;
        // 透明背景
        background-color: rgba(0, 0, 0, 0);
        z-index: 2;
    }

    // 播放状态下隐藏鼠标
    .play-to-paused-page.hidden {
        cursor: none;
    }

    // 错误信息显示
    .show-error {
        @extend %absolute-all;
        z-index: 3;

        // 错误文字
        .show-error-text {
            font-size: 20px;
            font-weight: bold;
            color: red;
            background-color: rgba(0, 0, 0, 0.8);
            padding: 10px 20px;
            border-radius: 10px;
        }
    }
}

// 字幕样式
::cue {
    color: rgba(230, 230, 230);
    background: rgba(0, 0, 0, 0.4);
    font-family: "SmileySans", "Microsoft YaHei", Arial, sans-serif;
    line-height: 2em;
}

/* 
HTML: <div class="loader"></div> 
参考: https://css-loaders.com/infinity/ 
*/
.loader {
    width: calc(80px / cos(45deg));
    height: 14px;
    background: repeating-linear-gradient(-45deg, var(--jpz-color-primary) 0 15px, #0000 0 20px) left/200% 100%;
    animation: l3 2s infinite linear;
    border-radius: 7px;
    z-index: 2;
}

@keyframes l3 {
    100% {
        background-position: right;
    }
}

@include respond-to("pc") {
    // ::cue {
    //     font-size: 32px;
    // }

    .video-container {
        width: pc.$width-video-main;
    }

    .video-container[data-preview="wechat"] {
        width: 390px;
    }
}

@include respond-to("pad") {
    // ::cue {
    //     font-size: 24px;
    // }

    .video-container {
        max-width: pad.$width-video-main;
        max-height: pad.$height-video-main;
    }

    .video-container[data-preview="wechat"] {
        max-width: pad.$width-video-main;
        max-height: pad.$height-video-main;
        width: 100%;
    }
}

@include respond-to("phone") {
    // ::cue {
    //     font-size: 16px;
    // }

    .video-container {
        max-width: phone.$width-video-main;
        max-height: phone.$height-video-main;
    }

    .my-video {
        max-width: phone.$width-video-main;
        max-height: phone.$height-video-main;
    }

    .video-container[data-preview="wechat"] {
        max-width: phone.$width-video-main;
        max-height: phone.$height-video-main;
        width: 100%;
    }
}
</style>
