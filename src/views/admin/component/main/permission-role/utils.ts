/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 12:01:04
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 12:04:42
 * @FilePath     : \blog-client\src\views\admin\component\main\permission-role\utils.ts
 * @Description  : 工具
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { LimitPeriod, type PermissionRole } from "./types"

/**
 * @description: 返回升序排序的限制时间键数组
 */
export const getSortedLimitPeriodKeys = (() => {
    let cache: string[] | null = null

    return () => {
        if (!cache) {
            const limitPeriodEntries = Object.entries(LimitPeriod)
                .filter(([, value]) => typeof value === "number")
                .sort(([, a], [, b]) => (a as number) - (b as number))

            cache = limitPeriodEntries.map(([key]) => key)
        }
        return cache
    }
})()

/**
 * @description: 获取对象安全属性
 */
export const getSafeProperty = (obj: Record<string, PermissionRole> | null, key: string, defaultValue: PermissionRole | null = null): PermissionRole | null => {
    if (!obj) return defaultValue
    return obj[key] !== undefined && obj[key] !== null ? obj[key] : defaultValue
}
