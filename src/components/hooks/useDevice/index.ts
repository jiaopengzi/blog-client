/**
 * FilePath    : blog-client\src\components\hooks\useDevice\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 不同设备的 hooks
 */

import { storeToRefs } from "pinia"
import { computed } from "vue"

import { DeviceType, useDeviceStore } from "@/stores/device"

/**
 * 根据设备类型返回不同的配置
 */
export const useDevice = () => {
    // 设备类型
    const deviceStore = useDeviceStore()

    const { device } = storeToRefs(deviceStore)

    // 描述列数
    const descriptionCols = computed(() => {
        return device.value === DeviceType.PHONE ? 1 : 3
    })

    // 分页布局
    const paginationLayout = computed(() => {
        return device.value === DeviceType.PHONE ? "total, prev, pager, next" : "total, prev, pager, next, jumper, sizes"
    })

    return {
        descriptionCols,
        paginationLayout,
    }
}
