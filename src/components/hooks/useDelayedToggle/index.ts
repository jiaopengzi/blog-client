/**
 * FilePath    : blog-client\src\components\hooks\useDelayedToggle\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 带延时的显示隐藏状态钩子
 */

import { ref } from "vue"

/**
 * 带延时的显示隐藏状态钩子，用于控制一些需要延时隐藏的 UI 元素，避免频繁触发显示隐藏
 * @param delay 延时隐藏的时间，默认 150 毫秒
 * @returns isVisible: 是否显示的响应式变量，show: 显示函数，hide: 隐藏函数，destroy: 销毁函数
 */
export function useDelayedToggle(delay = 150, autoHideTime = 0) {
    const isVisible = ref(false)

    let hideTimer: number | null = null
    let autoHideTimer: number | null = null

    const clearTimers = () => {
        if (hideTimer) {
            clearTimeout(hideTimer)
            hideTimer = null
        }
        if (autoHideTimer) {
            clearTimeout(autoHideTimer)
            autoHideTimer = null
        }
    }

    const show = () => {
        clearTimers()
        isVisible.value = true

        // 如果启用了自动隐藏，在 autoHideTime 后隐藏
        if (autoHideTime > 0) {
            autoHideTimer = window.setTimeout(() => {
                isVisible.value = false
                autoHideTimer = null
            }, autoHideTime)
        }
    }

    const hide = () => {
        clearTimers()
        // 延迟隐藏
        hideTimer = window.setTimeout(() => {
            isVisible.value = false
            hideTimer = null
        }, delay)
    }

    const toggle = () => {
        if (isVisible.value) {
            hide()
        } else {
            show()
        }
    }

    const destroy = () => {
        clearTimers()
    }

    return { isVisible, show, hide, toggle, destroy }
}
