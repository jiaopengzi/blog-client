/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 11:31:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 11:31:51
 * @FilePath     : \blog-client\src\components\editor\toc\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { Heading } from "@/components/editor/core"

export interface TocProps {
    headingShowCurrentIndex: number // 当前显示的 heading 索引
    headings: Array<Heading> // 预览内容
}
