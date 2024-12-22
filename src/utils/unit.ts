/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-12 15:09:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-22 12:18:11
 * @FilePath     : \blog-client\src\utils\unit.ts
 * @Description  : 单位转换
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

/**
 * @description: 单位转换
 * @param src 源数据 string | number
 * @return string 返回带单位的数据
 */
export function unit(src: string | number): string {
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
export function isZero(src: string | number): boolean {
    // 首先判断 src 是否为 string 类型,转换为int
    const temp = typeof src === "string" ? parseInt(src) : (src as number)

    // 如果 src 不是数字,返回false
    if (isNaN(temp)) {
        return false
    }

    return temp === 0
}
