/*
 * FilePath    : blog-client-nuxt\src\utils\typeOf.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型判断工具类
 */

/**
 * @description: 判断是否为对象
 * @param obj 任意类型
 * @return 是否为对象
 */
export function isObject(obj: unknown): boolean {
    return obj !== null && typeof obj === "object"
}

/**
 * @description: 判断是否为数组
 * @param arr 任意类型
 * @return 是否为数组
 */
export function isArray(arr: unknown): boolean {
    return Array.isArray(arr) || Object.prototype.toString.call(arr) === "[object Array]"
}

/**
 * @description: 判断是否为函数
 * @param fn 任意类型
 * @return 是否为函数
 */
export function isFunction(fn: unknown): boolean {
    return typeof fn === "function"
}

/**
 * @description: 判断是否为字符串
 * @param str 任意类型
 * @return 是否为字符串
 */
export function isString(str: unknown): boolean {
    return typeof str === "string"
}

/**
 * @description: 判断是否为数字
 * @param num 任意类型
 * @return 是否为数字
 */
export function isNumber(num: unknown): boolean {
    return typeof num === "number"
}

/**
 * @description: 判断是否为布尔值
 * @param bool 任意类型
 * @return 是否为布尔值
 */
export function isBoolean(bool: unknown): boolean {
    return typeof bool === "boolean"
}

/**
 * @description: 判断是否为 undefined
 * @param val 任意类型
 * @return 是否为 undefined
 */
export function isUndefined(val: unknown): boolean {
    return typeof val === "undefined"
}

/**
 * @description: 判断是否为 null
 * @param val 任意类型
 * @return 是否为 null
 */
export function isNull(val: unknown): boolean {
    return val === null
}

/**
 * @description: 判断是否为 NaN
 * @param val 任意类型
 * @return 是否为 NaN
 */
export function isNaN(val: unknown): boolean {
    return Number.isNaN(val)
}

/**
 * @description: 判断是否为 Symbol
 * @param val 任意类型
 * @return 是否为 Symbol
 */
export function isSymbol(val: unknown): boolean {
    return typeof val === "symbol"
}

/**
 * @description: 判断是否为 Promise
 * @param val 任意类型
 * @return 是否为 Promise
 */
export function isPromise(val: unknown): boolean {
    return val instanceof Promise
}

/**
 * @description: 判断是否为 Set
 * @param val 任意类型
 * @return 是否为 Set
 */
export function isSet(val: unknown): boolean {
    return val instanceof Set
}

/**
 * @description: 判断是否为 Map
 * @param val 任意类型
 * @return 是否为 Map
 */
export function isMap(val: unknown): boolean {
    return val instanceof Map
}

/**
 * @description: 判断是否为 Date
 * @param val 任意类型
 * @return 是否为 Date
 */
export function isDate(val: unknown): boolean {
    return val instanceof Date
}

/**
 * @description: 判断是否为 RegExp
 * @param val 任意类型
 * @return 是否为 RegExp
 */
export function isRegExp(val: unknown): boolean {
    return val instanceof RegExp
}

/**
 * @description: 判断是否为 Error
 * @param val 任意类型
 * @return 是否为 Error
 */
export function isError(val: unknown): boolean {
    return val instanceof Error
}
