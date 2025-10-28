/*
 * FilePath    : blog-client\src\views\admin\component\main\dashboard\trend\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import { TimeDimension } from "@/api/dashboard/common"

// 趋势维度选项
export interface DimensionItem {
    name: DimensionItemName
    label: string
    dimension: TimeDimension
    is_current: boolean
}

// 维度名称枚举
export enum DimensionItemName {
    Today = "today",
    Yesterday = "yesterday",
    ThisWeek = "this_week",
    LastWeek = "last_week",
    ThisMonth = "this_month",
    LastMonth = "last_month",
    ThisYear = "this_year",
    LastYear = "last_year",
}

// 维度名称显示
export const DimensionItemNameDisplay: Record<DimensionItemName, string> = {
    [DimensionItemName.Today]: "今日",
    [DimensionItemName.Yesterday]: "昨日",
    [DimensionItemName.ThisWeek]: "本周",
    [DimensionItemName.LastWeek]: "上周",
    [DimensionItemName.ThisMonth]: "本月",
    [DimensionItemName.LastMonth]: "上月",
    [DimensionItemName.ThisYear]: "今年",
    [DimensionItemName.LastYear]: "去年",
}

// 维度名称选项
export const getDimensionItemNameOptions = () => {
    return Object.values(DimensionItemName).map((value) => ({
        label: DimensionItemNameDisplay[value as DimensionItemName],
        value: value as DimensionItemName,
    }))
}
