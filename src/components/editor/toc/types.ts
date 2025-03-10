/**
 * @FilePath     : \blog-client\src\components\editor\toc\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import type { Heading } from "@/components/editor/core"

export interface TocProps {
    headingShowCurrentIndex: number // 当前显示的 heading 索引
    headings: Array<Heading> // 预览内容
}
