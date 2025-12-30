/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\theme\index.ts
 * Description : 统一导出主题
 */

import { type Extension } from "@codemirror/state"

import { vscodeDark } from "./vscodeDark"
import { vscodeLight } from "./vscodeLight"

// 导出枚举, 方便后续按枚举调用
export enum Theme {
    vscodeDark = "vscodeDark",
    vscodeLight = "vscodeLight",
}

// 主题集合
export const themeMap: Readonly<Record<Theme, Extension>> = {
    [Theme.vscodeDark]: vscodeDark,
    [Theme.vscodeLight]: vscodeLight,
}
