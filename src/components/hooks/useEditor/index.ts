/*
 * FilePath    : blog-client\src\components\hooks\useEditor\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 处理编辑器状态
 */

import { storeToRefs } from "pinia"
import { watch } from "vue"

import { defaultCommandKeys, EditorStateManager } from "@/components/editor"
import { DeviceType, useDeviceStore } from "@/stores/device"

/**
 * @description: 处理编辑器状态
 */
export function useEditor(stateManager: EditorStateManager) {
    const deviceStore = useDeviceStore()
    const { device } = storeToRefs(deviceStore)

    watch(
        () => device.value,
        (newVal) => {
            const mode = stateManager.getState().mode

            if (newVal === DeviceType.PC && mode === "post") {
                stateManager.setCommandKeys(defaultCommandKeys.postPc)
            }

            if (newVal === DeviceType.PAD && mode === "post") {
                stateManager.setCommandKeys(defaultCommandKeys.postPad)
            }

            if (newVal === DeviceType.PHONE && mode === "post") {
                stateManager.setCommandKeys(defaultCommandKeys.postPhone)
            }

            if (newVal === DeviceType.PC && mode === "comment") {
                stateManager.setCommandKeys(defaultCommandKeys.commentPc)
            }

            if (newVal === DeviceType.PAD && mode === "comment") {
                stateManager.setCommandKeys(defaultCommandKeys.commentPad)
            }

            if (newVal === DeviceType.PHONE && mode === "comment") {
                stateManager.setCommandKeys(defaultCommandKeys.commentPhone)
            }
        },
        { immediate: true },
    )
}
