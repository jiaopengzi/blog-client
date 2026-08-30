/*
 * FilePath    : blog-client-nuxt\src\stores\device.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 设备信息
 */

import { acceptHMRUpdate, defineStore } from "pinia"

// 设备类型
export enum DeviceType {
    PC = "pc",
    PAD = "pad",
    PHONE = "phone",
}

// 获取设备类型 (SSR 守卫: 服务端无 window, 默认桌面端, 客户端 hydration 后校准 —— 计划 1.6)
export function getDeviceType(): DeviceType {
    if (typeof window === "undefined") {
        return DeviceType.PC
    }

    const width = window.innerWidth

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

// 创建设备信息 (SSR 守卫: 默认窗口宽度 1920, 客户端再校准)
function createDeviceStore(): DeviceStore {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1920
    return {
        device: getDeviceType(),
        windowWidth,
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

        // 设置窗口宽度 (SSR 守卫)
        updateWindowWidth() {
            if (typeof window === "undefined") return
            this.windowWidth = window.innerWidth
        },

        /**
         * 根据设备类型截断文本
         * @param text 文本内容
         * @param pcLength PC 端最大长度, 默认 40
         * @param padLength PAD 端最大长度, 默认 15
         * @param phoneLength PHONE 端最大长度, 默认 12
         * @param suffix 后缀, 默认 "..."
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

// 允许开发环境下进行热更新 HMR (Hot Module Replacement)
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useDeviceStore, import.meta.hot))
}
