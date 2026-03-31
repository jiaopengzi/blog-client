/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\theme\index.ts
 * Description : 统一导出主题
 */

import { Compartment, type Extension } from "@codemirror/state"

import { githubDark } from "./github/dark"
import { githubLight } from "./github/light"
import { getLintTheme } from "./lint"
import { mdDark } from "./md/dark"
import { mdLight } from "./md/light"
import { tokyonightDark } from "./tokyonight/dark"
import { tokyonightLight } from "./tokyonight/light"
import { vueDark } from "./vue/dark"
import { vueLight } from "./vue/light"
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
    GitHub = "github",
    Vue = "vue",
    TokyoNight = "tokyonight",
}

export const presetThemeMap: Record<ThemePresetId, Theme> = {
    light: Theme.MD,
    dark: Theme.MD,
    "github-light": Theme.GitHub,
    "github-dark": Theme.GitHub,
    "vue-light": Theme.Vue,
    "vue-dark": Theme.Vue,
    "tokyonight-day": Theme.TokyoNight,
    "tokyonight-night": Theme.TokyoNight,
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
    [`${Theme.GitHub}${ThemeMode.Dark}`]: [githubDark, getLintTheme(true)],
    [`${Theme.GitHub}${ThemeMode.Light}`]: [githubLight, getLintTheme(false)],
    [`${Theme.Vue}${ThemeMode.Dark}`]: [vueDark, getLintTheme(true)],
    [`${Theme.Vue}${ThemeMode.Light}`]: [vueLight, getLintTheme(false)],
    [`${Theme.TokyoNight}${ThemeMode.Dark}`]: [tokyonightDark, getLintTheme(true)],
    [`${Theme.TokyoNight}${ThemeMode.Light}`]: [tokyonightLight, getLintTheme(false)],
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
