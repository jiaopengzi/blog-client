/*
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\trend\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : hooks
 */

import { TimeDimension } from "@/api/dashboard/common"

import { type DimensionItem, DimensionItemName, DimensionItemNameDisplay } from "./types"

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
