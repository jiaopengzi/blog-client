/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\theme\index.ts
 * Description : 统一导出主题
 */

import { Compartment, type Extension } from "@codemirror/state"

import { getLintTheme } from "./lint"
import { mdDark } from "./md/dark"
import { mdLight } from "./md/light"
import { vscodeDark } from "./vscode/dark"
import { vscodeLight } from "./vscode/light"
import type { ThemePresetId } from "@/theme/presets"

// 主题 compartment 用于动态切换主题
export const themeCompartment = new Compartment()

// 导出枚举, 方便后续按枚举调用
export enum ThemeMode {
    Dark = "Dark",
    Light = "Light",
}

// 导出枚举, 方便后续按枚举调用
export enum Theme {
    MD = "md",
    Vscode = "vscode",
}

export const presetThemeMap: Record<ThemePresetId, Theme> = {
    light: Theme.MD,
    dark: Theme.MD,
    "github-light": Theme.MD,
    "github-dark": Theme.MD,
    "vue-light": Theme.Vscode,
    "vue-dark": Theme.Vscode,
    "tokyonight-day": Theme.Vscode,
    "tokyonight-night": Theme.Vscode,
}

// 定义主题键的类型
export type ThemeKey = `${Theme}${ThemeMode}`

// 更严格的类型定义
export type ThemeMapType = {
    readonly [key in ThemeKey]: Extension
}

// 主题映射表 - 使用直接拼接方式
export const themeMap: ThemeMapType = {
    [`${Theme.MD}${ThemeMode.Dark}`]: [mdDark, getLintTheme(true)],
    [`${Theme.MD}${ThemeMode.Light}`]: [mdLight, getLintTheme(false)],
    [`${Theme.Vscode}${ThemeMode.Dark}`]: [vscodeDark, getLintTheme(true)],
    [`${Theme.Vscode}${ThemeMode.Light}`]: [vscodeLight, getLintTheme(false)],
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

export function getThemeByPreset(presetId: ThemePresetId, mode: ThemeMode): Extension {
    return getTheme(presetThemeMap[presetId], mode)
}
