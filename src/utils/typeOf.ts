/**
 * @Author       : jiaopengzi
 * @Date         : 2024-02-14 16:35:26
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-02-14 16:35:47
 * @FilePath     : \blog-client\src\utils\typeOf.ts
 * @Description  : 类型判断工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

/**
 * @description: 判断是否为对象
 * @param obj 任意类型
 * @return 是否为对象
 */
export function isObject(obj: any): boolean {
    return obj !== null && typeof obj === "object"
}

/**
 * @description: 判断是否为数组
 * @param arr 任意类型
 * @return 是否为数组
 */
export function isArray(arr: any): boolean {
    return Array.isArray(arr) || Object.prototype.toString.call(arr) === "[object Array]"
}

/**
 * @description: 判断是否为函数
 * @param fn 任意类型
 * @return 是否为函数
 */
export function isFunction(fn: any): boolean {
    return typeof fn === "function"
}

/**
 * @description: 判断是否为字符串
 * @param str 任意类型
 * @return 是否为字符串
 */
export function isString(str: any): boolean {
    return typeof str === "string"
}

/**
 * @description: 判断是否为数字
 * @param num 任意类型
 * @return 是否为数字
 */
export function isNumber(num: any): boolean {
    return typeof num === "number"
}

/**
 * @description: 判断是否为布尔值
 * @param bool 任意类型
 * @return 是否为布尔值
 */
export function isBoolean(bool: any): boolean {
    return typeof bool === "boolean"
}

/**
 * @description: 判断是否为undefined
 * @param val 任意类型
 * @return 是否为undefined
 */
export function isUndefined(val: any): boolean {
    return typeof val === "undefined"
}

/**
 * @description: 判断是否为null
 * @param val 任意类型
 * @return 是否为null
 */
export function isNull(val: any): boolean {
    return val === null
}

/**
 * @description: 判断是否为NaN
 * @param val 任意类型
 * @return 是否为NaN
 */
export function isNaN(val: any): boolean {
    return Number.isNaN(val)
}

/**
 * @description: 判断是否为Symbol
 * @param val 任意类型
 * @return 是否为Symbol
 */
export function isSymbol(val: any): boolean {
    return typeof val === "symbol"
}

/**
 * @description: 判断是否为Promise
 * @param val 任意类型
 * @return 是否为Promise
 */
export function isPromise(val: any): boolean {
    return val instanceof Promise
}

/**
 * @description: 判断是否为Set
 * @param val 任意类型
 * @return 是否为Set
 */
export function isSet(val: any): boolean {
    return val instanceof Set
}

/**
 * @description: 判断是否为Map
 * @param val 任意类型
 * @return 是否为Map
 */
export function isMap(val: any): boolean {
    return val instanceof Map
}

/**
 * @description: 判断是否为Date
 * @param val 任意类型
 * @return 是否为Date
 */
export function isDate(val: any): boolean {
    return val instanceof Date
}

/**
 * @description: 判断是否为RegExp
 * @param val 任意类型
 * @return 是否为RegExp
 */
export function isRegExp(val: any): boolean {
    return val instanceof RegExp
}

/**
 * @description: 判断是否为Error
 * @param val 任意类型
 * @return 是否为Error
 */
export function isError(val: any): boolean {
    return val instanceof Error
}
