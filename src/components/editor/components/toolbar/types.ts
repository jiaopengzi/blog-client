/*
 * FilePath    : blog-client\src\components\editor\components\toolbar\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

// ComponentPublicInstance 与 HTMLElement 并集 为了解决 $el 问题
// 参考：https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-template-refs
// export interface ToolbarRef extends HTMLElement {
//     root: HTMLElement
// }

// 表格行列
export interface TableRowCol {
    row: number
    col: number
}

// 提醒
export enum Alerts {
    NOTE = "> [!NOTE]\n> ",
    TIP = "> [!TIP]\n> ",
    IMPORTANT = "> [!IMPORTANT]\n> ",
    WARNING = "> [!WARNING]\n> ",
    CAUTION = "> [!CAUTION]\n> ",
}
