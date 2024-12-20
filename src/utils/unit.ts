/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-12 15:09:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-20 11:04:46
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
    // 首先判断 src 是否为 string 类型,转换为int
    const temp = typeof src === "string" ? parseInt(src) : (src as number)

    // 如果 src 不是数字,返回空字符串
    if (isNaN(temp)) {
        return ""
    }

    // 显示千分符 , 如果大于 1 万 就显示 ?w
    return temp > 10000 ? `${Math.floor(temp / 10000)}w` : src.toLocaleString()
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
