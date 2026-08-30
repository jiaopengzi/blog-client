/*
 * FilePath    : blog-client-nuxt\src\components\player\hooks\fullScreen.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 全屏
 */

import screenfull from "screenfull"
import { type Reactive, type Ref, watch } from "vue"

import { PlayerStateManager } from "../state"
import { type PlayerState } from "../types"

/**
 * @description: 在浏览器原生全屏开启时退出全屏.
 * @return void.
 */
const handleExitFullscreen = async (): Promise<void> => {
    if (screenfull.isEnabled && screenfull.isFullscreen) {
        await screenfull.exit()
    }
}

export function useFullscreen(
    videoContainerRef: Ref<HTMLElement | null>,
    videoRef: Ref<HTMLVideoElement | null>,
    localManager: PlayerStateManager,
    localPlayerState: Reactive<PlayerState>,
) {
    // 进入网页全屏, 调整 video 元素的宽高
    const adjustSizeWebFullscreen = () => {
        if (videoContainerRef.value && videoRef.value) {
            videoRef.value.style.width = "100vw"
            videoRef.value.style.height = "100vh"
            videoContainerRef.value.style.width = "100vw"
            videoContainerRef.value.style.height = "100vh"
        }
    }

    // 进入全屏, 调整 video 元素的宽高
    const adjustSizeFullscreen = () => {
        if (videoRef.value) {
            videoRef.value.style.width = "100%"
            videoRef.value.style.height = "100%"
        }
    }

    // 通用退出全屏, 调整 video 元素的宽高
    const adjustSizeExitFullscreen = () => {
        if (videoContainerRef.value && videoRef.value) {
            videoRef.value.style.width = ""
            videoRef.value.style.height = ""
            videoContainerRef.value.style.width = ""
            videoContainerRef.value.style.height = ""
        }
    }

    const handleFullscreenChange = () => {
        if (screenfull.isEnabled) {
            localManager.setIsFullScreen(screenfull.isFullscreen)

            if (screenfull.isFullscreen) {
                adjustSizeFullscreen()
            } else {
                adjustSizeExitFullscreen()
            }
        }
    }

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

    watch(
        () => localPlayerState.isFullScreen,
        (isFullScreen) => {
            // 获取屏幕方向对象, 断言为 ScreenOrientation 类型
            const orientation = screen.orientation as ScreenOrientation

            if (isFullScreen) {
                if (videoContainerRef.value && videoRef.value) {
                    if (screenfull.isEnabled) {
                        adjustSizeFullscreen()
                        screenfull.request(videoContainerRef.value)
                    }

                    if (localPlayerState.isIphone) {
                        // Safari for iOS
                        const videoElement = videoRef.value as HTMLVideoElement & {
                            webkitEnterFullscreen?: () => void
                        }
                        if (videoElement.webkitEnterFullscreen) {
                            videoElement.webkitEnterFullscreen()
                            localManager.setIsFullScreen(false) // 只要进入全屏就设置为 false, 退出后也是 false
                        }
                    }
                }
            } else {
                handleExitFullscreen()

                if (orientation && typeof orientation.unlock === "function") orientation.unlock()
            }
        },
    )

    return {
        handleFullscreenChange,
        handleOrientationChange,
    }
}
