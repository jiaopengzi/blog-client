/*
 * FilePath    : blog-client\src\components\hooks\useWebFullscreen\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 网页全屏 hook
 */

import { onMounted, onUnmounted, ref, unref } from "vue"

// 全屏样式类名, 需要在全局样式设定样式
const WEB_FULLSCREEN_CLASS = "web--fullscreen"

/**
 * @description: 全屏处理函数
 * @param {MaybeElementRef} target - 目标元素的引用
 */
export const useWebFullscreen = (target: MaybeElementRef) => {
    const isWebFullscreen = ref(false)
    let targetElement: MaybeElement = null

    // 统一处理元素获取
    const getTargetElement = () => {
        return target ? unref(target) : document.documentElement
    }

    // 应用全屏样式
    const applyFullscreenStyle = () => {
        targetElement = getTargetElement()
        if (!targetElement) return

        targetElement.classList.add(WEB_FULLSCREEN_CLASS)
        document.documentElement.style.overflow = "hidden"
    }

    // 清除全屏样式
    const clearFullscreenStyle = () => {
        if (!targetElement) return

        targetElement.classList.remove(WEB_FULLSCREEN_CLASS)
        document.documentElement.style.overflow = ""
    }

    // 进入全屏
    const enter = () => {
        if (isWebFullscreen.value) return
        isWebFullscreen.value = true
        applyFullscreenStyle()
    }

    // 退出全屏
    const exit = () => {
        if (!isWebFullscreen.value) return
        isWebFullscreen.value = false
        clearFullscreenStyle()
    }

    // 切换全屏状态
    const toggle = () => {
        if (isWebFullscreen.value) {
            exit()
        } else {
            enter()
        }
    }

    // ESC键监听
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isWebFullscreen.value) {
            exit()
        }
    }

    // 生命周期管理
    onMounted(() => window.addEventListener("keydown", handleEscape))
    onUnmounted(() => {
        window.removeEventListener("keydown", handleEscape)
        exit() // 确保卸载时清除状态
    })

    return {
        isWebFullscreen,
        enter,
        exit,
        toggle,
    }
}
