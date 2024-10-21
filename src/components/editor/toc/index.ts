/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-19 15:05:31
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-21 19:54:59
 * @FilePath     : \blog-client\src\components\editor\toc\index.ts
 * @Description  : ts 声明文件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import type { Heading } from "@/components/editor/core"

export { default } from "./index.vue"

export interface TocProps {
    headingShowCurrentIndex: number // 当前显示的 heading 索引
    headings: Array<Heading> // 预览内容
}
