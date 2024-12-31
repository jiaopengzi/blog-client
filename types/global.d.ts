/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-19 17:31:49
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-31 11:58:55
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
// 对象中值为string类型的string键名
type StringKeys<T> = Extract<
    {
        [K in keyof T]: T[K] extends string | undefined ? K : never
    }[keyof T],
    string
>

// 对象中值为number类型的string键名
type NumberKeys<T> = Extract<
    {
        [K in keyof T]: T[K] extends number | undefined ? K : never
    }[keyof T],
    string
>

// 对象中值为boolean类型的string键名
type BooleanKeys<T> = Extract<
    {
        [K in keyof T]: T[K] extends boolean | undefined ? K : never
    }[keyof T],
    string
>

// interface Example {
//     str: string
//     strOption?: string
//     num: number
//     numOption?: number
//     bool: boolean
//     boolOption?: boolean
// }

// type ExampleStringKeys = StringKeys<Example> // 期望 "str" | "strOption" 实际 "str" | "undefined"
// type ExampleNumberKeys = NumberKeys<Example> // 期望 "num" | "numOption" 实际 "num" | "undefined"
// type ExampleBooleanKeys = BooleanKeys<Example> // 期望 "bool" | "boolOption" 实际 "bool" | "undefined"

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
