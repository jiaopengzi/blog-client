/**
 * FilePath    : blog-client-dev\src\theme\runtime.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 主题运行时相关的工具函数
 */

import type { ThemePalette, ThemePreset } from "./presets"

const themeStyleId = "theme-preset-style"

/**
 * 规范化十六进制颜色值, 统一输出 6 位 hex 字符串.
 * @param color 原始颜色值.
 * @returns 标准化后的 hex 颜色.
 */
function normalizeHex(color: string): string {
    const normalized = color.trim().replace("#", "")

    if (normalized.length === 3) {
        return `#${normalized
            .split("")
            .map((char) => `${char}${char}`)
            .join("")}`
    }

    return `#${normalized.slice(0, 6)}`
}

/**
 * 将 hex 颜色转换为 RGB 通道值.
 * @param color 十六进制颜色值.
 * @returns RGB 通道对象.
 */
function hexToRgb(color: string) {
    const normalized = normalizeHex(color)
    const value = normalized.slice(1)

    return {
        r: Number.parseInt(value.slice(0, 2), 16),
        g: Number.parseInt(value.slice(2, 4), 16),
        b: Number.parseInt(value.slice(4, 6), 16),
    }
}

/**
 * 将 RGB 通道值转换回 hex 颜色值.
 * @param r 红色通道.
 * @param g 绿色通道.
 * @param b 蓝色通道.
 * @returns 十六进制颜色值.
 */
function rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b]
        .map((value) => {
            const clamped = Math.max(0, Math.min(255, Math.round(value)))
            return clamped.toString(16).padStart(2, "0")
        })
        .join("")}`
}

/**
 * 按权重混合两种颜色, 用于生成主题派生色.
 * @param colorA 主颜色.
 * @param colorB 混合颜色.
 * @param weight 主颜色占比, 取值 0-100.
 * @returns 混合后的 hex 颜色值.
 */
function mixHexColors(colorA: string, colorB: string, weight: number): string {
    const first = hexToRgb(colorA)
    const second = hexToRgb(colorB)
    const ratio = weight / 100

    return rgbToHex(first.r * ratio + second.r * (1 - ratio), first.g * ratio + second.g * (1 - ratio), first.b * ratio + second.b * (1 - ratio))
}

/**
 * 为 Element Plus 生成单组品牌色变量.
 * @param name 颜色组名称, 例如 primary.
 * @param color 基础颜色.
 * @param scheme 当前明暗模式.
 * @returns 一组可写入 style 的 CSS 变量声明.
 */
function buildElementColorGroup(name: string, color: string, scheme: ThemePreset["scheme"]): string[] {
    const mixedBase = scheme === "dark" ? "#141414" : "#ffffff"
    const darkMixBase = scheme === "dark" ? "#ffffff" : "#000000"
    const levels = [2, 3, 5, 7, 8, 9]

    return [
        `--el-color-${name}: ${color};`,
        ...levels.map((level) => {
            if (level === 2) {
                return `--el-color-${name}-dark-${level}: ${mixHexColors(darkMixBase, color, 20)};`
            }

            return `--el-color-${name}-light-${level}: ${mixHexColors(mixedBase, color, level * 10)};`
        }),
    ]
}

/**
 * 基于主题色板生成运行时 CSS 变量文本.
 * @param palette 当前主题色板.
 * @param scheme 当前明暗模式.
 * @returns 拼接后的 CSS 变量字符串.
 */
function buildThemeCssVariables(palette: ThemePalette, scheme: ThemePreset["scheme"]): string {
    const vars: string[] = [
        `color-scheme: ${scheme};`,
        `--jpz-color-primary: ${palette.primary};`,
        `--jpz-color-secondary: ${palette.secondary};`,
        `--jpz-color-success: ${palette.success};`,
        `--jpz-color-warning: ${palette.warning};`,
        `--jpz-color-danger: ${palette.danger};`,
        `--jpz-color-error: ${palette.error};`,
        `--jpz-color-info: ${palette.info};`,
        `--code-bg-color: ${palette.codeBg};`,
        `--code-color: ${palette.codeText};`,
        `--jpz-blockquote-border-color: ${palette.blockquoteBorder};`,
        `--footnote-sup-color: ${palette.footnoteSup};`,
        `--jpz-post-thumbnail-main-bg-start: ${mixHexColors(palette.primary, "#0f172a", 70)};`,
        `--jpz-post-thumbnail-main-bg-end: ${mixHexColors("#0f172a", scheme === "dark" ? "#1f2937" : "#ffffff", 74)};`,
        `--jpz-post-thumbnail-aside-bg-start: ${mixHexColors(palette.primary, "#111827", 58)};`,
        `--jpz-post-thumbnail-aside-bg-end: ${mixHexColors("#1f2937", scheme === "dark" ? "#111827" : "#ffffff", 82)};`,
        `--horizontal-divider-color: ${palette.primary};`,
    ]

    vars.push(...buildElementColorGroup("primary", palette.primary, scheme))
    vars.push(...buildElementColorGroup("success", palette.success, scheme))
    vars.push(...buildElementColorGroup("warning", palette.warning, scheme))
    vars.push(...buildElementColorGroup("danger", palette.danger, scheme))
    vars.push(...buildElementColorGroup("error", palette.error, scheme))
    vars.push(...buildElementColorGroup("info", palette.info, scheme))

    return vars.join("\n")
}

/**
 * 确保主题 style 节点存在, 供运行时写入 preset 变量.
 * @returns 主题 style 节点; 在非浏览器环境下返回 null.
 */
function ensureThemeStyleElement(): HTMLStyleElement | null {
    if (typeof document === "undefined") {
        return null
    }

    let styleElement = document.getElementById(themeStyleId) as HTMLStyleElement | null
    if (styleElement) {
        return styleElement
    }

    styleElement = document.createElement("style")
    styleElement.id = themeStyleId
    document.head.appendChild(styleElement)
    return styleElement
}

/**
 * 将主题预设应用到文档根节点.
 * @param preset 当前要生效的主题预设.
 */
export function applyThemePresetToDocument(preset: ThemePreset): void {
    if (typeof document === "undefined") {
        return
    }

    const root = document.documentElement
    const styleElement = ensureThemeStyleElement()

    root.setAttribute("data-theme", preset.id)
    root.classList.remove("light", "dark")
    root.classList.add(preset.scheme)

    if (!styleElement) {
        return
    }

    styleElement.textContent = `html[data-theme="${preset.id}"] {\n${buildThemeCssVariables(preset.palette, preset.scheme)}\n}`
}
