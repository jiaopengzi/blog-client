/**
 * FilePath    : blog-client\src\components\player\hooks\fullScreen.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 全屏
 */

import screenfull from "screenfull"
import { type Reactive, type Ref, watch } from "vue"

import { PlayerStateManager } from "../state"
import { type PlayerState } from "../types"

// 全屏 hook
export function useFullscreen(
    videoContainerRef: Ref<HTMLElement | null>,
    videoRef: Ref<HTMLVideoElement | null>,
    localManager: PlayerStateManager,
    localPlayerState: Reactive<PlayerState>,
) {
    // 进入网页全屏 调整 video 元素的宽高
    const adjustSizeWebFullscreen = () => {
        if (videoContainerRef.value && videoRef.value) {
            videoRef.value.style.width = "100vw"
            videoRef.value.style.height = "100vh"
            videoContainerRef.value.style.width = "100vw"
            videoContainerRef.value.style.height = "100vh"
        }
    }

    // 进入全屏 调整 video 元素的宽高
    const adjustSizeFullscreen = () => {
        if (videoRef.value) {
            videoRef.value.style.width = "100%"
            videoRef.value.style.height = "100%"
        }
    }

    // 通用退出全屏 调整 video 元素的宽高
    const adjustSizeExitFullscreen = () => {
        if (videoContainerRef.value && videoRef.value) {
            // 移除宽高样式
            videoRef.value.style.width = ""
            videoRef.value.style.height = ""
            videoContainerRef.value.style.width = ""
            videoContainerRef.value.style.height = ""
        }
    }

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

    // 监控全屏状态
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

    return {
        handleFullscreenChange,
        handleOrientationChange,
    }
}
