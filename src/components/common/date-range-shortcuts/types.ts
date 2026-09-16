/**
 * FilePath    : blog-client\src\components\common\date-range-shortcuts\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 日期快捷筛选组件类型
 */

/** 快捷日期选项 */
export interface DateShortcut {
    /** 按钮显示文本 */
    label: string
    /** 获取日期范围 [开始, 结束] */
    getRange: () => [Date, Date]
}

/** 组件 Props */
export interface DateRangeShortcutsProps {
    /** 开始时间 (v-model:start) */
    start?: string
    /** 结束时间 (v-model:end) */
    end?: string
    /** 快捷选项列表, 不传则使用默认 */
    shortcuts?: DateShortcut[]
    /** 开始时间 placeholder */
    startPlaceholder?: string
    /** 结束时间 placeholder */
    endPlaceholder?: string
    /** 日期选择器宽度, 默认 190px */
    pickerWidth?: string
}

/** 默认快捷选项 */
export const defaultShortcuts: DateShortcut[] = [
    {
        label: "今天",
        getRange: () => {
            const start = new Date()
            start.setHours(0, 0, 0, 0)
            const end = new Date()
            return [start, end]
        },
    },
    {
        label: "近7天",
        getRange: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 6)
            start.setHours(0, 0, 0, 0)
            return [start, end]
        },
    },
    {
        label: "近30天",
        getRange: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 29)
            start.setHours(0, 0, 0, 0)
            return [start, end]
        },
    },
    {
        label: "本周",
        getRange: () => {
            const now = new Date()
            const day = now.getDay() || 7
            const start = new Date(now)
            start.setDate(now.getDate() - day + 1)
            start.setHours(0, 0, 0, 0)
            const end = new Date(start)
            end.setDate(start.getDate() + 6)
            end.setHours(23, 59, 59, 999)
            return [start, end]
        },
    },
    {
        label: "本月",
        getRange: () => {
            const now = new Date()
            const start = new Date(now.getFullYear(), now.getMonth(), 1)
            start.setHours(0, 0, 0, 0)
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            end.setHours(23, 59, 59, 999)
            return [start, end]
        },
    },
    {
        label: "本季度",
        getRange: () => {
            const now = new Date()
            const quarter = Math.floor(now.getMonth() / 3)
            const start = new Date(now.getFullYear(), quarter * 3, 1)
            start.setHours(0, 0, 0, 0)
            const end = new Date(now.getFullYear(), quarter * 3 + 3, 0)
            end.setHours(23, 59, 59, 999)
            return [start, end]
        },
    },
    {
        label: "今年",
        getRange: () => {
            const now = new Date()
            const start = new Date(now.getFullYear(), 0, 1)
            start.setHours(0, 0, 0, 0)
            const end = new Date(now.getFullYear(), 11, 31)
            end.setHours(23, 59, 59, 999)
            return [start, end]
        },
    },
]
