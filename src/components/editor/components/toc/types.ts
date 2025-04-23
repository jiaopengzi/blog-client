/*
 * FilePath    : blog-client\src\components\editor\components\toc\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

// h 标签类型
export interface Heading {
    index: number
    level: number
    text: string
    anchor: string // 锚点
}

export interface TocProps {
    headingShowCurrentIndex: number // 当前显示的 heading 索引
    headings: Heading[] // 预览内容
}
