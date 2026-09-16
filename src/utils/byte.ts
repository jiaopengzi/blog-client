/**
 * FilePath    : blog-client\src\utils\byte.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 字节转换
 */

// 定义字节单位枚举(基于 1024 进制)
export enum ByteUnit {
    B = "B", // 字节
    KB = "KB", // 千字节
    MB = "MB", // 兆字节
    GB = "GB", // 千兆字节
    TB = "TB", // 太字节
    PB = "PB", // 拍字节
    EB = "EB", // 艾字节
}

// 单位对应的指数(以 1024 为底)
const UNIT_EXPONENT: Record<ByteUnit, number> = {
    [ByteUnit.B]: 0,
    [ByteUnit.KB]: 1,
    [ByteUnit.MB]: 2,
    [ByteUnit.GB]: 3,
    [ByteUnit.TB]: 4,
    [ByteUnit.PB]: 5,
    [ByteUnit.EB]: 6,
}

/**
 * 将数值从一个字节单位转换为另一个字节单位
 *
 * @param value - 原始数值
 * @param fromUnit - 原始单位
 * @param toUnit - 目标单位
 * @returns 转换后的数值
 */
export function convertBytes(value: number, fromUnit: ByteUnit, toUnit: ByteUnit): number {
    if (value < 0) {
        throw new Error("数值不能为负数")
    }

    const fromExp = UNIT_EXPONENT[fromUnit]
    const toExp = UNIT_EXPONENT[toUnit]

    // 转换为字节(B), 再转为目标单位
    const bytes = value * Math.pow(1024, fromExp)
    const result = bytes / Math.pow(1024, toExp)

    return result
}
