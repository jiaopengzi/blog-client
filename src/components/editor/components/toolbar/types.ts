/*
 * FilePath    : blog-client\src\components\editor\components\toolbar\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

import type { IconKeys } from "@/components/common/icons"

import { CommandsKey } from "../../command"

// ComponentPublicInstance 与 HTMLElement 并集 为了解决 $el 问题
// 参考：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-template-refs
export interface ToolbarRef extends HTMLElement {
    root: HTMLElement
}

export interface ToolbarProps {
    toolbarBtns: Array<{ name: CommandsKey; display: string; icon: IconKeys }> // 预览内容
    iconNumberPerLine?: number // iconNumberPerLine 可选 每行显示的图标个数 默认 20
}

// 表格行列
export interface TableRowCol {
    row: number
    col: number
}
