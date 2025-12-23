/**
 * FilePath    : blog-client-dev\src\components\player\hooks\mouse.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 鼠标事件
 */

import { type Ref, ref } from "vue"

import { PlayerStateManager } from "../state"

// 鼠标事件 hook
export function useMouse(controlsContainerRef: Ref<HTMLElement | null>, localManager: PlayerStateManager) {
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

    return {
        controlsHidden,
        handleMousemove,
        handleMouseenter,
        handleMouseleave,
    }
}
