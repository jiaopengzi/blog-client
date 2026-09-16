/**
 * FilePath    : blog-client\src\theme\presets\shared\types.ts
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
    bg: string
    bgPage: string
    bgFooter: string
    bgOverlay: string
    border: string
    borderHover: string
    borderLighter: string
    shadowLighter: string
    shadowLight: string
    shadow: string
    fillLighter: string
    textPrimary: string
    textRegular: string
    textSecondary: string
    textPlaceholder: string
    textDisabled: string
    codeBlockBg: string
    codeBlockColor: string
    blockquoteColor: string
    blockquoteBg: string
    tableBorder: string
    tableHeaderBg: string
    tableBg: string
    tableN2Bg: string
    tableN21Bg: string
    tableStriped: string
    scrollbarThumb: string
    markBg: string
    markColor: string
}

export interface ThemePreset {
    id: ThemePresetId
    label: string
    description: string
    scheme: ThemeScheme
    palette: ThemePalette
}
