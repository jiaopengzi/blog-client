/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-24 18:34:35
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-26 13:11:39
 * @FilePath     : \blog-client\src\utils\naming-conversion.ts
 * @Description  : 命名转换
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

/**
 * @description: 将大驼峰转成小写短横线连接
 * @param str 大驼峰字符串
 * @return  小写短横线连接字符串
 */
export function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * @description: 将短横线连接转成大驼峰
 * @param str 短横线连接字符串
 * @return  大驼峰字符串
 */
export function kebabToPascalCase(input: string): string {
  return input
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}
