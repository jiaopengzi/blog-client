/**
 * FilePath    : blog-client-dev\src\theme\presets\shared\types.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 类型
 */

export type ThemeScheme = "light" | "dark"

export type ThemePresetId = "light" | "dark" | "github-dark" | "github-light" | "vue-dark" | "vue-light" | "tokyonight-night" | "tokyonight-day"

export interface ThemePalette {
    primary: string
    secondary: string
    success: string
    warning: string
    danger: string
    error: string
    info: string
    footnoteSup: string
    codeBg: string
    codeText: string
    blockquoteBorder: string
    alertImportant: string
}

export interface ThemePreset {
    id: ThemePresetId
    label: string
    description: string
    scheme: ThemeScheme
    palette: ThemePalette
}
