/*
 * FilePath    : blog-client-nuxt\src\components\player\hooks\mouse.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 鼠标事件
 */

import { type Ref, ref } from "vue"

import { PlayerStateManager } from "../state"

export function useMouse(controlsContainerRef: Ref<HTMLElement | null>, localManager: PlayerStateManager) {
    const controlsHidden = ref(true)
    let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null

    const handleMousemove = (event: MouseEvent) => {
        // 鼠标在控制器上时不隐藏控制器
        if (controlsContainerRef.value && controlsContainerRef.value.contains(event.target as Node)) {
            controlsHidden.value = false
            if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
            return
        }

        controlsHidden.value = false
        if (hideControlsTimeout) clearTimeout(hideControlsTimeout)

        // 不移动 3s 后隐藏控制器
        hideControlsTimeout = setTimeout(() => {
            controlsHidden.value = true
        }, 3000)
    }

    const handleMouseenter = (event: MouseEvent) => {
        localManager.setShortcutKey(true)

        // 鼠标在控制器上时不隐藏控制器
        if (controlsContainerRef.value && controlsContainerRef.value.contains(event.target as Node)) {
            controlsHidden.value = false
            if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
            return
        }
        controlsHidden.value = false
    }

    const handleMouseleave = (event: MouseEvent) => {
        localManager.setShortcutKey(false)

        // 鼠标在控制器上时不隐藏控制器
        if (controlsContainerRef.value && controlsContainerRef.value.contains(event.target as Node)) {
            controlsHidden.value = false

            // 清除隐藏定时器, 保持控制器可见
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
