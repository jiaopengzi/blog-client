/**
 * FilePath    : blog-client\src\pkg\highlight.js\theme-switcher.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : highlight.js 主题动态切换工具.
 */

import { scopeCssToSelector } from "@/utils/style"

const HLJS_THEME_STYLE_ID = "hljs-dynamic-theme"
const MD_PREVIEW_SCOPE_SELECTOR = ".md-page-preview"

const themeCssModules = import.meta.glob("/node_modules/highlight.js/styles/*.min.css", { query: "?inline", eager: false })

export const AVAILABLE_HLJS_THEMES = Object.freeze(
    Object.keys(themeCssModules).map((modulePath) => modulePath.replace("/node_modules/highlight.js/styles/", "").replace(".min.css", "")),
)

export type HljsThemeName = string

const DEFAULT_THEME: HljsThemeName = "tokyo-night-light"

let currentTheme: HljsThemeName | null = null

function getThemeModulePath(themeName: HljsThemeName): string {
    return `/node_modules/highlight.js/styles/${themeName}.min.css`
}

export function getDefaultHljsTheme(): HljsThemeName {
    return DEFAULT_THEME
}

export function getCurrentHljsTheme(): HljsThemeName | null {
    return currentTheme
}

/**
 * @description: 为 /md 页面生成局部作用域的 highlight.js 主题 CSS.
 * @param cssContent 原始主题 CSS 文本.
 * @return 仅作用于 /md 预览容器的主题 CSS.
 */
function scopeMdHighlightThemeCss(cssContent: string): string {
    return scopeCssToSelector(cssContent, MD_PREVIEW_SCOPE_SELECTOR)
}

export async function setHljsTheme(themeName: HljsThemeName): Promise<void> {
    if (currentTheme === themeName) {
        return
    }

    const existingStyle = document.getElementById(HLJS_THEME_STYLE_ID)
    if (existingStyle) {
        existingStyle.remove()
    }

    const modulePath = getThemeModulePath(themeName)
    const loader = themeCssModules[modulePath]

    if (!loader) {
        console.error(`Highlight.js theme not found: ${themeName}`)
        return
    }

    try {
        const cssModule = (await loader()) as { default: string }
        const css = scopeMdHighlightThemeCss(cssModule.default)
        const style = document.createElement("style")
        style.id = HLJS_THEME_STYLE_ID
        style.textContent = css
        document.head.appendChild(style)
        currentTheme = themeName
    } catch (err) {
        console.error(`Failed to load highlight.js theme: ${themeName}`, err)
    }
}
