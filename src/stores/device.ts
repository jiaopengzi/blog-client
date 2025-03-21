/*
 * FilePath    : blog-client\src\stores\device.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 设备信息
 */

import { acceptHMRUpdate, defineStore } from "pinia"

// import { MessageUtil } from "@/utils/message"

// 设备类型
export enum DeviceType {
    PC = "pc",
    PAD = "pad",
    PHONE = "phone",
}

// 获取设备类型
export function getDeviceType(): DeviceType {
    const width = window.innerWidth
    // console.log("============>window.innerWidth", window.innerWidth)
    // MessageUtil.success(`w:${window.innerWidth}`, 0)

    if (width >= 1219) {
        return DeviceType.PC
    } else if (width >= 768) {
        return DeviceType.PAD
    } else {
        return DeviceType.PHONE
    }
}

// 设备信息
export interface DeviceStore {
    device: DeviceType // 设备类型
}

// 创建设备信息
function createDeviceStore(): DeviceStore {
    return {
        device: getDeviceType(),
    }
}

export const useDeviceStore = defineStore("device", {
    state: () => createDeviceStore(),

    getters: {
        // 获取设备类型
        getDevice(): DeviceType {
            return this.device
        },
    },

    actions: {
        // 设置设备类型
        updateDevice() {
            this.device = getDeviceType()
        },
    },
})

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useDeviceStore, import.meta.hot))
}
