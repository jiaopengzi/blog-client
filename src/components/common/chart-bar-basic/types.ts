/*
 * FilePath    : blog-client\src\components\common\chart-bar-basic\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { Row } from "@/api/dashboard/common"

// 每个柱子的数据项
export interface BarItem extends Row {
    order?: number // 排序
    color?: string // 颜色
}

// 柱状图-基础版 组件 Props 类型
export interface ChartBarBasicProps {
    title?: string

    /** 图表数据 */
    data?: BarItem[]

    /** 图表宽度 */
    width?: number

    /** 图表高度 */
    height?: number

    /** 柱子颜色 */
    color?: string
}
