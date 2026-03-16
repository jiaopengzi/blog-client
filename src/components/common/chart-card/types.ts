/*
 * FilePath    : blog-client\src\components\common\chart-card\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

// 卡片图属性
export interface ChartCardProps {
    /** 唯一标识 */
    name?: string

    /** 标签 */
    label?: string

    /** 数值 */
    value?: number

    /** 自定义展示文本 */
    displayValue?: string

    /** 宽度 */
    width?: number

    /** 高度 */
    height?: number

    /** 背景色 */
    bgColor?: string

    /** 是否为金额分 */
    isAmountFen?: boolean

    /** 是否可点击 */
    isClick?: boolean
}
