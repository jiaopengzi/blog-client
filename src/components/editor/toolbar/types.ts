/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-30 11:32:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-30 11:32:39
 * @FilePath     : \blog-client\src\components\editor\toolbar\types.ts
 * @Description  : 类型
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { IconKeys } from "@/components/common/icons"
import { CommandsKey } from "@/components/editor/command"

export interface ToolbarProps {
    toolbarBtns: Array<{ name: CommandsKey; display: string; icon: IconKeys }> // 预览内容
    iconNumberPerLine?: number // iconNumberPerLine 可选 每行显示的图标个数 默认 20
}

// 表格行列
export interface TableRowCol {
    row: number
    col: number
}
