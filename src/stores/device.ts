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
    windowWidth: number // 窗口宽度
}

// 创建设备信息
function createDeviceStore(): DeviceStore {
    return {
        device: getDeviceType(),
        windowWidth: window.innerWidth,
    }
}

export const useDeviceStore = defineStore("device", {
    state: () => createDeviceStore(),

    getters: {
        // 获取设备类型
        getDevice(): DeviceType {
            return this.device
        },

        // 获取窗口宽度
        getWindowWidth(): number {
            return this.windowWidth
        },
    },

    actions: {
        // 设置设备类型
        updateDevice() {
            this.device = getDeviceType()
        },

        // 设置窗口宽度
        updateWindowWidth() {
            this.windowWidth = window.innerWidth
        },

        /**
         * 根据设备类型截断文本
         * @param text 文本内容
         * @param pcLength PC 端最大长度，默认18
         * @param padLength PAD 端最大长度，默认15
         * @param phoneLength PHONE 端最大长度，默认12
         * @param suffix 后缀，默认"..."
         * @returns 截断后的文本
         */
        truncateText(text: string, pcLength: number = 40, padLength: number = 15, phoneLength: number = 12, suffix: string = "..."): string {
            let maxLength = pcLength
            if (this.device === DeviceType.PAD) {
                maxLength = padLength
            } else if (this.device === DeviceType.PHONE) {
                maxLength = phoneLength
            }
            if (text.length <= maxLength) {
                return text
            }
            if (suffix) {
                return text.slice(0, maxLength) + suffix
            }
            return text.slice(0, maxLength)
        },
    },
})

// 允许开发环境下进行热更新 HMR(Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useDeviceStore, import.meta.hot))
}
