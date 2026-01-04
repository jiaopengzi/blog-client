/**
 * FilePath    : blog-client-dev\src\views\user-info\component\hook.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : hooks
 */

import { storeToRefs } from "pinia"
import { computed } from "vue"

import { DeviceType, useDeviceStore } from "@/stores/device"

export const useUserInfo = () => {
    // 设备类型
    const deviceStore = useDeviceStore()

    const { device } = storeToRefs(deviceStore)

    // 描述列数
    const descriptionCols = computed(() => {
        return device.value === DeviceType.PHONE ? 1 : 3
    })

    return {
        descriptionCols,
    }
}
