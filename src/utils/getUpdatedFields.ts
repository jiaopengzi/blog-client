/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 19:42:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 20:36:45
 * @FilePath     : \blog-client\src\utils\getUpdatedFields.ts
 * @Description  : 获取更新字段
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

/**
 * @description: 深度比较两个对象是否相等
 * @param obj1 对象1
 * @param obj2 对象2
 * @return  {boolean} 是否相等
 */
function deepEqual(obj1: any, obj2: any): boolean {
    // 如果两个对象相等直接返回
    if (obj1 === obj2) {
        return true
    }

    // 如果两个对象不是对象或者为null直接返回
    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
        return false
    }

    // 获取对象的key
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    // 如果两个对象的key数量不相等直接返回
    if (keys1.length !== keys2.length) {
        return false
    }

    // 遍历对象的key
    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false
        }
    }

    return true
}

/**
 * @description: 获取更新字段
 * @param original 原始数据
 * @param current 当前数据
 * @param primaryKey 主键字段
 * @return {Partial<T>} 已经更新的字段 如果没有更新则返回空对象
 */
export function getUpdatedFields<T>(original: T, current: T, primaryKey: keyof T): Partial<T> {
    // 存储已经更新的字段
    const updatedFields: Partial<T> = {}

    // 遍历所有字段
    for (const field in current) {
        // 如果不是主键字段并且当前字段和原始字段不相等则添加到更新字段中
        if (field !== primaryKey && !deepEqual(current[field], original[field])) {
            updatedFields[field] = current[field]
        }
    }

    return updatedFields
}
