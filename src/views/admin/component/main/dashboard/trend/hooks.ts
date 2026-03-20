/*
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\trend\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : hooks
 */

import { TrendCategory, TimeDimension } from "@/api/dashboard/common"
import { LocalStorageKey } from "@/stores/local"

import { type DimensionItem, DimensionItemName, DimensionItemNameDisplay, type TrendSelectionStorage } from "./types"

/**
 * 判断值是否为合法的趋势分类.
 * @param value 待校验的原始值.
 * @returns 合法时返回 true, 否则返回 false.
 */
const isTrendCategory = (value: unknown): value is TrendCategory => {
    return typeof value === "string" && Object.values(TrendCategory).includes(value as TrendCategory)
}

/**
 * 判断值是否为合法的时间维度名称.
 * @param value 待校验的原始值.
 * @returns 合法时返回 true, 否则返回 false.
 */
const isDimensionItemName = (value: unknown): value is DimensionItemName => {
    return typeof value === "string" && Object.values(DimensionItemName).includes(value as DimensionItemName)
}

/**
 * 读取本地缓存的趋势筛选项.
 * @returns 返回合法的筛选项, 无缓存或缓存非法时返回 null.
 */
export const getSavedTrendSelection = (): TrendSelectionStorage | null => {
    const savedTrendSelection = localStorage.getItem(LocalStorageKey.DashboardTrendSelection)

    if (!savedTrendSelection) {
        return null
    }

    try {
        const parsedSelection = JSON.parse(savedTrendSelection) as Partial<TrendSelectionStorage>

        if (!isTrendCategory(parsedSelection.category) || !isDimensionItemName(parsedSelection.time)) {
            return null
        }

        return {
            category: parsedSelection.category,
            time: parsedSelection.time,
        }
    } catch {
        return null
    }
}

/**
 * 持久化当前趋势筛选项到本地缓存.
 * @param category 当前选中的趋势分类.
 * @param time 当前选中的时间维度名称.
 * @returns 无返回值.
 */
export const persistTrendSelection = (category: TrendCategory, time: DimensionItemName): void => {
    localStorage.setItem(
        LocalStorageKey.DashboardTrendSelection,
        JSON.stringify({
            category,
            time,
        } satisfies TrendSelectionStorage),
    )
}

/**
 * 提供趋势图所需的维度选项与本地持久化辅助方法.
 * @returns 返回趋势图维度映射与维度选项方法.
 */
export function useTrend() {
    // 获取所有维度选项
    const getAllDimension = () => {
        const allItems: DimensionItem[] = []

        // 今日
        allItems.push({
            name: DimensionItemName.Today,
            label: DimensionItemNameDisplay[DimensionItemName.Today],
            dimension: TimeDimension.Hour,
            is_current: true,
        })

        // 昨日
        allItems.push({
            name: DimensionItemName.Yesterday,
            label: DimensionItemNameDisplay[DimensionItemName.Yesterday],
            dimension: TimeDimension.Hour,
            is_current: false,
        })

        // 本周
        allItems.push({
            name: DimensionItemName.ThisWeek,
            label: DimensionItemNameDisplay[DimensionItemName.ThisWeek],
            dimension: TimeDimension.Week,
            is_current: true,
        })

        // 上周
        allItems.push({
            name: DimensionItemName.LastWeek,
            label: DimensionItemNameDisplay[DimensionItemName.LastWeek],
            dimension: TimeDimension.Week,
            is_current: false,
        })

        // 本月
        allItems.push({
            name: DimensionItemName.ThisMonth,
            label: DimensionItemNameDisplay[DimensionItemName.ThisMonth],
            dimension: TimeDimension.Day,
            is_current: true,
        })

        // 上月
        allItems.push({
            name: DimensionItemName.LastMonth,
            label: DimensionItemNameDisplay[DimensionItemName.LastMonth],
            dimension: TimeDimension.Day,
            is_current: false,
        })

        // 今年
        allItems.push({
            name: DimensionItemName.ThisYear,
            label: DimensionItemNameDisplay[DimensionItemName.ThisYear],
            dimension: TimeDimension.Month,
            is_current: true,
        })

        // 去年
        allItems.push({
            name: DimensionItemName.LastYear,
            label: DimensionItemNameDisplay[DimensionItemName.LastYear],
            dimension: TimeDimension.Month,
            is_current: false,
        })

        return allItems
    }

    // 所有维度选项映射
    const allDimensionMap = getAllDimension().reduce((map, item) => {
        map.set(item.name, item)
        return map
    }, new Map<DimensionItemName, DimensionItem>())

    return {
        getAllDimension,
        allDimensionMap,
    }
}
