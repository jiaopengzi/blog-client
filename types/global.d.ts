/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-19 17:31:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-23 15:47:47
 * @FilePath     : \blog-client\types\global.d.ts
 * @Description  : 扩展全局类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

// document 全屏属性
interface Document {
    webkitFullscreenElement?: Element
    mozFullScreenElement?: Element
    msFullscreenElement?: Element
}

// 获取可选参数类型
type JpzOptional<T> = {
    [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P]
}

// 获取可选参数key作为数组
type JpzOptionalKeys<T> = {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K
}[keyof T]

// 获取必选参数key作为数组
type JpzRequiredKeys<T> = {
    [K in keyof T]: T extends Record<K, T[K]> ? K : never
}[keyof T]
