/*
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\dashboard\post-visit-top\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 内容访问排行的类型定义
 */

import { TimeDimension } from "@/api/dashboard/common"

// 排行时间范围枚举(后端仅支持 day/week/month 维度)
export enum PostVisitRange {
    Today = "today",
    Yesterday = "yesterday",
    ThisWeek = "this_week",
    LastWeek = "last_week",
    ThisMonth = "this_month",
    LastMonth = "last_month",
}

// 排行时间范围显示
export const PostVisitRangeDisplay: Record<PostVisitRange, string> = {
    [PostVisitRange.Today]: "今日",
    [PostVisitRange.Yesterday]: "昨日",
    [PostVisitRange.ThisWeek]: "本周",
    [PostVisitRange.LastWeek]: "上周",
    [PostVisitRange.ThisMonth]: "本月",
    [PostVisitRange.LastMonth]: "上月",
}

// 排行筛选本地存储结构
export interface PostVisitTopSelectionStorage {
    range: PostVisitRange
    topN: number
}

// 排行数量默认值
export const POST_VISIT_TOP_N_DEFAULT = 10

// 排行数量上限(与后端 DTO 校验的 max 保持一致)
export const POST_VISIT_TOP_N_MAX = 100

// 排行数量下限(与后端 DTO 校验的 min 保持一致)
export const POST_VISIT_TOP_N_MIN = 1

// 排行数量合法值集合: 1 与 10 的整倍数(步进按集合对齐, 而非简单累加)
export const POST_VISIT_TOP_N_STEPS: readonly number[] = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

/**
 * stepPostVisitTopN 步进到集合中的上一个/下一个值.
 * 例: 1 加 -> 10, 11 加 -> 20, 11 减 -> 10, 10 减 -> 1, 已在端点时保持不变.
 * @param current - 当前值(任意数字).
 * @param dir - 1 表示加, -1 表示减.
 * @returns 集合中的目标值.
 */
export function stepPostVisitTopN(current: number, dir: 1 | -1): number {
    const value = clampPostVisitTopN(current)

    if (dir === 1) {
        // 大于当前值的最小集合元素(端点 100 时保持)
        return POST_VISIT_TOP_N_STEPS.find((step) => step > value) ?? POST_VISIT_TOP_N_MAX
    }

    // 小于当前值的最大集合元素(端点 1 时保持)
    return POST_VISIT_TOP_N_STEPS.findLast((step) => step < value) ?? POST_VISIT_TOP_N_MIN
}

/**
 * alignPostVisitTopN 将任意值就近对齐到合法值集合(用于手动输入, 四舍五入).
 * 例: 4 -> 1, 5 -> 10, 14 -> 10, 15 -> 20, 95 -> 100.
 * @param value - 任意输入值.
 * @returns 集合中最接近的值.
 */
export function alignPostVisitTopN(value: number): number {
    const n = clampPostVisitTopN(value)
    if (n <= POST_VISIT_TOP_N_MIN) {
        return POST_VISIT_TOP_N_MIN
    }

    const rounded = Math.round(n / 10) * 10

    return Math.min(POST_VISIT_TOP_N_MAX, Math.max(POST_VISIT_TOP_N_MIN, rounded))
}

/**
 * postVisitRangeToDimension 将时间范围映射为后端请求的时间维度与当期标记.
 * @param range - 时间范围枚举.
 * @returns dimension 时间维度, isCurrent 是否当期.
 */
export function postVisitRangeToDimension(range: PostVisitRange): { dimension: TimeDimension; isCurrent: boolean } {
    switch (range) {
        case PostVisitRange.Today:
            return { dimension: TimeDimension.Day, isCurrent: true }
        case PostVisitRange.Yesterday:
            return { dimension: TimeDimension.Day, isCurrent: false }
        case PostVisitRange.ThisWeek:
            return { dimension: TimeDimension.Week, isCurrent: true }
        case PostVisitRange.LastWeek:
            return { dimension: TimeDimension.Week, isCurrent: false }
        case PostVisitRange.ThisMonth:
            return { dimension: TimeDimension.Month, isCurrent: true }
        case PostVisitRange.LastMonth:
            return { dimension: TimeDimension.Month, isCurrent: false }
        default:
            return { dimension: TimeDimension.Day, isCurrent: true }
    }
}

/**
 * clampPostVisitTopN 将排行数量收敛到合法区间 [1, 100] 并取整.
 * @param value - 任意输入值.
 * @returns 合法的排行数量.
 */
export function clampPostVisitTopN(value: number): number {
    if (!Number.isFinite(value)) {
        return POST_VISIT_TOP_N_DEFAULT
    }

    const n = Math.floor(value)

    return Math.min(POST_VISIT_TOP_N_MAX, Math.max(POST_VISIT_TOP_N_MIN, n))
}
