/*
 * FilePath    : blog-client\src\pkg\codemirror\options.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器选项
 */

import { type Completion } from "@codemirror/autocomplete"

// 主题名称枚举
// export enum ThemeName {
// }

// createCustomSetup 定义options 类型
export type CustomSetupOptions = {
    vimMode?: boolean // 是否开启 vim 模式
    // theme?: ThemeName // 主题名称
    mention?: Completion[] // @提及补全
}

// 默认选项
export const defaultOptions: CustomSetupOptions = {
    vimMode: false, // 默认不开启 vim 模式
    // theme: ThemeName.Dracula, // 默认主题
    mention: [], // 默认不开启 @ 提及补全
}
