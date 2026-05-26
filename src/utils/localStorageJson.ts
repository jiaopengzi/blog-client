/**
 * FilePath    : blog-client\src\utils\localStorageJson.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : localStorage JSON 读写工具
 */

/**
 * loadLocalStorageJson 从 localStorage 中读取并解析 JSON 数据.
 * @param key - localStorage 键名.
 * @param validate - 可选的数据校验函数, 返回 false 时读取结果视为无效.
 * @returns 解析后的数据, 不存在, JSON 非法或校验失败时返回 null.
 */
export function loadLocalStorageJson<T>(key: string, validate?: (value: unknown) => value is T): T | null {
    const raw = localStorage.getItem(key)
    if (!raw) {
        return null
    }

    try {
        const parsed = JSON.parse(raw) as unknown
        if (validate && !validate(parsed)) {
            return null
        }
        return parsed as T
    } catch {
        return null
    }
}

/**
 * saveLocalStorageJson 将数据序列化为 JSON 后写入 localStorage.
 * @param key - localStorage 键名.
 * @param value - 需要保存的数据.
 * @returns 无返回值.
 */
export function saveLocalStorageJson<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
}

/**
 * removeLocalStorageJson 从 localStorage 中删除指定键.
 * @param key - localStorage 键名.
 * @returns 无返回值.
 */
export function removeLocalStorageJson(key: string): void {
    localStorage.removeItem(key)
}

/**
 * loadLocalStorageRecord 读取 localStorage 中的对象集合, 并过滤非法条目.
 * @param key - localStorage 键名.
 * @param validateItem - 集合条目的校验函数.
 * @returns 只包含合法条目的对象集合.
 */
export function loadLocalStorageRecord<T>(key: string, validateItem: (value: unknown) => value is T): Record<string, T> {
    const parsed = loadLocalStorageJson<Record<string, unknown>>(key, isRecordObject)
    if (!parsed) {
        return {}
    }

    return Object.entries(parsed).reduce<Record<string, T>>((collection, [itemKey, itemValue]) => {
        if (validateItem(itemValue)) {
            collection[itemKey] = itemValue
        }
        return collection
    }, {})
}

/**
 * isRecordObject 判断未知数据是否为普通对象集合.
 * @param value - 待校验数据.
 * @returns true 表示数据可作为键值集合处理.
 */
function isRecordObject(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}
