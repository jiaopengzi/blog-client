/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-17 15:20:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-03 11:56:12
 * @FilePath     : \blog-client\src\utils\device.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// 设备类型
export enum DeviceType {
    PC = "pc",
    PAD = "pad",
    PHONE = "phone",
}

export function getDeviceType(): DeviceType {
    const width = window.innerWidth

    if (width >= 1024) {
        return DeviceType.PC
    } else if (width >= 768) {
        return DeviceType.PAD
    } else {
        return DeviceType.PHONE
    }
}
