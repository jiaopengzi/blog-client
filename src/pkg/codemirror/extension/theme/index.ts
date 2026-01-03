/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\theme\index.ts
 * Description : 统一导出主题
 */

import { Compartment, type Extension } from "@codemirror/state"

import { vscodeDark } from "./vscode/dark"
import { vscodeLight } from "./vscode/light"

// 主题 compartment 用于动态切换主题
export const themeCompartment = new Compartment()

// 导出枚举, 方便后续按枚举调用
export enum ThemeMode {
    Dark = "Dark",
    Light = "Light",
}

// 导出枚举, 方便后续按枚举调用
export enum Theme {
    vscode = "vscode",
}

// 定义主题键的类型
export type ThemeKey = `${Theme}${ThemeMode}`

// 更严格的类型定义
export type ThemeMapType = {
    readonly [key in ThemeKey]: Extension
}

// 主题映射表 - 使用直接拼接方式
export const themeMap: ThemeMapType = {
    [`${Theme.vscode}${ThemeMode.Dark}`]: vscodeDark,
    [`${Theme.vscode}${ThemeMode.Light}`]: vscodeLight,
} as const

/**
 * 获取主题扩展
 * @param theme 主题
 * @param mode 模式 - 明亮/黑暗
 * @returns 主题扩展
 */
export function getTheme(theme: Theme, mode: ThemeMode): Extension {
    const key = `${theme}${mode}` as ThemeKey
    return themeMap[key]
}
