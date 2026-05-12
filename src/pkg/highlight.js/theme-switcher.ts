/**
 * FilePath    : blog-client\src\pkg\highlight.js\theme-switcher.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : highlight.js 主题动态切换工具.
 */

import { scopeCssToSelector } from "@/utils/style"

const MD_HLJS_THEME_STYLE_ID = "hljs-dynamic-theme"
const SITE_HLJS_THEME_STYLE_ID = "hljs-site-theme"
const MD_PREVIEW_SCOPE_SELECTOR = ".md-page-preview"

const themeCssModules = import.meta.glob("/node_modules/highlight.js/styles/*.min.css", { query: "?inline", eager: false })

export const AVAILABLE_HLJS_THEMES = Object.freeze(
    Object.keys(themeCssModules).map((modulePath) => modulePath.replace("/node_modules/highlight.js/styles/", "").replace(".min.css", "")),
)

export type HljsThemeName = string

const DEFAULT_THEME: HljsThemeName = "tokyo-night-light"

let currentTheme: HljsThemeName | null = null
let currentSiteTheme: HljsThemeName | null = null

function getThemeModulePath(themeName: HljsThemeName): string {
    return `/node_modules/highlight.js/styles/${themeName}.min.css`
}

/**
 * @description: 读取指定 highlight.js 主题的原始 CSS 文本.
 * @param themeName 主题名称.
 * @return 主题 CSS 文本, 找不到时返回 null.
 */
async function loadThemeCss(themeName: HljsThemeName): Promise<string | null> {
    const modulePath = getThemeModulePath(themeName)
    const loader = themeCssModules[modulePath]

    if (!loader) {
        console.error(`Highlight.js theme not found: ${themeName}`)
        return null
    }

    try {
        const cssModule = (await loader()) as { default: string }
        return cssModule.default
    } catch (err) {
        console.error(`Failed to load highlight.js theme: ${themeName}`, err)
        return null
    }
}

export function getDefaultHljsTheme(): HljsThemeName {
    return DEFAULT_THEME
}

export function getCurrentHljsTheme(): HljsThemeName | null {
    return currentTheme
}

/**
 * @description: 返回当前主站生效的 highlight.js 主题.
 * @return 当前主站主题名称.
 */
export function getCurrentSiteHljsTheme(): HljsThemeName | null {
    return currentSiteTheme
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

    const existingStyle = document.getElementById(MD_HLJS_THEME_STYLE_ID)
    if (existingStyle) {
        existingStyle.remove()
    }

    const cssContent = await loadThemeCss(themeName)
    if (!cssContent) {
        return
    }

    const css = scopeMdHighlightThemeCss(cssContent)
    const style = document.createElement("style")
    style.id = MD_HLJS_THEME_STYLE_ID
    style.textContent = css
    document.head.appendChild(style)
    currentTheme = themeName
}

/**
 * @description: 为主站设置全局 highlight.js 主题.
 * 默认主题直接回退到静态引入的样式, 非默认主题通过动态 style 覆盖.
 * @param themeName 主题名称.
 * @return 无返回值.
 */
export async function setSiteHljsTheme(themeName: HljsThemeName): Promise<void> {
    if (currentSiteTheme === themeName) {
        return
    }

    const existingStyle = document.getElementById(SITE_HLJS_THEME_STYLE_ID)
    if (existingStyle) {
        existingStyle.remove()
    }

    if (themeName === DEFAULT_THEME) {
        currentSiteTheme = themeName
        return
    }

    const cssContent = await loadThemeCss(themeName)
    if (!cssContent) {
        return
    }

    const style = document.createElement("style")
    style.id = SITE_HLJS_THEME_STYLE_ID
    style.textContent = cssContent
    document.head.appendChild(style)
    currentSiteTheme = themeName
}
