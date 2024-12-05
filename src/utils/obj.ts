/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 22:23:57
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-05 11:00:30
 * @FilePath     : \blog-client\src\utils\obj.ts
 * @Description  : 对象相关工具函数
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

/**
 * @description: 深度克隆一个对象
 * @param objSource 原对象
 * @return {T} 克隆后的对象
 */
export function deepClone<T>(objSource: T): T {
    // 如果不是对象或者为null，直接返回
    if (typeof objSource !== "object" || objSource === null) {
        return objSource
    }

    // 处理 Date 对象
    if (objSource instanceof Date) {
        return new Date(objSource.getTime()) as any as T
    }

    // 处理 RegExp 对象
    if (objSource instanceof RegExp) {
        return new RegExp(objSource) as any as T
    }

    // 处理 Map 对象
    if (objSource instanceof Map) {
        const mapClone = new Map()
        objSource.forEach((value, key) => {
            mapClone.set(key, deepClone(value))
        })
        return mapClone as any as T
    }

    // 处理 Set 对象
    if (objSource instanceof Set) {
        const setClone = new Set()
        objSource.forEach((value) => {
            setClone.add(deepClone(value))
        })
        return setClone as any as T
    }

    // 处理普通对象和数组
    const objClone = Array.isArray(objSource) ? [] : {}
    for (const key in objSource) {
        if (objSource.hasOwnProperty(key)) {
            ;(objClone as any)[key] = deepClone((objSource as any)[key])
        }
    }

    return objClone as T
}

/**
 * @description: 深度比较两个对象是否相等
 * @param obj1 对象1
 * @param obj2 对象2
 * @return  {boolean} 是否相等
 */
export function deepEqual<T>(obj1: T, obj2: T): boolean {
    // 如果两个对象相等直接返回true
    if (obj1 === obj2) {
        return true
    }

    // 如果两个对象不是对象或者为null，直接返回false
    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
        return false
    }

    // 获取两个对象的key
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    // 如果两个对象的key数量不相等，直接返回false
    if (keys1.length !== keys2.length) {
        return false
    }

    // 遍历对象的key
    for (const key of keys1) {
        // 检查key是否存在于obj2中，并递归调用deepEqual进行深度比较
        if (!keys2.includes(key) || !deepEqual((obj1 as any)[key], (obj2 as any)[key])) {
            return false
        }
    }

    // 如果所有key都相等，返回true
    return true
}

/**
 * @description: 获取更新字段
 * @param original 原始数据
 * @param current 当前数据
 * @param primaryKey 主键字段
 * @return {Partial<T>} 已经更新的字段 如果没有更新则返只有主键的对象
 */
export function getUpdatedFields<T>(original: T, current: T, primaryKey: keyof T): Partial<T> {
    // 存储已经更新的字段
    const updatedFields = {} as T

    // 遍历所有字段
    for (const field in current) {
        // 如果不是主键字段并且当前字段和原始字段不相等则添加到更新字段中
        if (field !== primaryKey && !deepEqual(current[field], original[field])) {
            updatedFields[field] = current[field]
        }
    }

    return updatedFields
}

/**
 * @description: 获取对象中的数字类型的顶层key数组
 * @param obj 对象
 * @return {keyof T} 数字类型的顶层key数组
 */
export function getNumberKeyOfTops<T>(obj: T): (keyof T)[] {
    return Object.keys(obj as object).filter(
        (key) => typeof obj[key as keyof T] === "number",
    ) as (keyof T)[]
}
