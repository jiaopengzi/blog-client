/**
 * @FilePath     : \blog-client\src\utils\enum.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 枚举工具
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description: 返回枚举的按照值排序后的键名数组
 * @param enumObj 枚举对象(数字值)
 * @param order 排序顺序，'asc' 表示升序，'desc' 表示降序，默认为 'asc'
 */
export const getSortedEnumKeys = (enumObj: any, order: "asc" | "desc" = "asc"): string[] => {
    const cacheKey = `${JSON.stringify(enumObj)}_${order}`
    if (!enumObj[cacheKey]) {
        const enumEntries = Object.entries(enumObj)
            .filter(([, value]) => typeof value === "number")
            // oxlint-disable-next-line unicorn/no-array-sort
            .sort(([, a], [, b]) => (order === "asc" ? (a as number) - (b as number) : (b as number) - (a as number)))
        enumObj[cacheKey] = enumEntries.map(([key]) => key)
    }
    return enumObj[cacheKey]
}
