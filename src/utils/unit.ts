/**
 * @FilePath     : \blog-client\src\utils\unit.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 单位转换
 */

/**
 * @description: 单位转换
 * @param src 源数据 string | number
 * @return string 返回带单位的数据
 */
export function unit(src: string | number | null | undefined): string {
    if (src === null || src === undefined) {
        return ""
    }

    // 首先判断 src 是否为 string 类型,转换为float
    const temp = typeof src === "string" ? parseFloat(src) : (src as number)

    // 如果 src 不是数字 或者 为0,返回空字符串
    if (isNaN(temp) || temp === 0) {
        return ""
    }

    // 如果小于1万,直接返回千分符字符串
    if (temp < 10000) {
        return temp.toLocaleString()
    }

    // 大于等于1万,且千位为0,返回带w的字符串
    if (Math.floor(temp / 1000) % 10 === 0) {
        return `${Math.floor(temp / 10000)}w`
    }

    // 大于等于1万,且千位不为0,返回带w的字符串
    return `${(temp / 10000).toFixed(1)}w`
}

/**
 * @description: 判断是否为0
 * @param src 源数据 string | number
 * @return boolean 返回是否为0
 */
export function isZero(src: string | number | null | undefined): boolean {
    if (src === null || src === undefined) {
        return true
    }

    // 首先判断 src 是否为 string 类型,转换为int
    const temp = typeof src === "string" ? parseInt(src) : (src as number)

    // 如果 src 不是数字,返回false
    if (isNaN(temp)) {
        return false
    }

    return temp === 0
}

/**
 * 将数字或数字字符串格式化为带中文计数单位(万/亿)的可读字符串。
 * @param src - 要格式化的值, 支持 number 或表示数字的字符串。
 * @returns 格式化后的字符串(带单位或原始数值字符串), 或在无法解析时返回空字符串 ""。
 */
export function unitNumber(src: string | number, toFixed: number = 2): string {
    const num = typeof src === "string" ? parseFloat(src) : src

    // 判断 num 是否为有效数字
    if (isNaN(num)) {
        return ""
    }

    const sign = num < 0 ? "-" : "" // 处理负数情况
    const abs = Math.abs(num) // 取绝对值进行单位转换

    if (abs >= 1e8) {
        return `${sign}${(abs / 1e8).toFixed(toFixed)}亿`
    } else if (abs >= 1e4) {
        return `${sign}${(abs / 1e4).toFixed(toFixed)}万`
    } else {
        // 对小于 1 万的数值也应用 toFixed 舍入, 避免浮点累加导致的精度误差
        // 例如 12.700000000000001 → toFixed(1) → "12.7" → parseFloat → 12.7 → "12.7"
        return `${sign}${parseFloat(abs.toFixed(toFixed)).toString()}`
    }
}
