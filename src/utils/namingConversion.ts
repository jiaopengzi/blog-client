/**
 * @FilePath     : \blog-client\src\utils\namingConversion.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 命名转换
 */

/**
 * @description: 将大驼峰转成小写短横线连接
 * @param str 大驼峰字符串
 * @return  小写短横线连接字符串
 */
export function toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

/**
 * @description: 将短横线连接转成大驼峰
 * @param str 短横线连接字符串
 * @return  大驼峰字符串
 */
export function kebabToPascalCase(input: string): string {
    return input
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
}
