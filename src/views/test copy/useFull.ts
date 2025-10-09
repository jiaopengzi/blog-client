import type { MaybeRef } from "vue"
import { onMounted, onUnmounted, ref, unref } from "vue"

// 参考: https://github.com/vueuse/vueuse/blob/main/packages/core/unrefElement/index.ts
export type MaybeElement = HTMLElement | SVGElement | undefined | null
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>

const WEB_FULLSCREEN_CLASS = "web--fullscreen"

/**
 * @description: 全屏处理函数
 * @param {MaybeElementRef} target - 目标元素的引用, 如果不传则默认全屏整个页面
 * @return {object} - 返回全屏状态和操作方法
 */
export const useWebFullscreen = (target?: MaybeElementRef): object => {
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
