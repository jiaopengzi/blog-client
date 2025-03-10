/**
 * @FilePath     : \blog-client\src\utils\device.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 设备类型
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
