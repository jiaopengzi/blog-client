/**
 * FilePath    : blog-client\src\stores\md-custom.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页面自定义配置状态管理，包含默认值、读取、保存和清除函数.
 */

import { LocalStorageKey } from "./local"

import { AVAILABLE_HLJS_THEMES, getDefaultHljsTheme, type HljsThemeName } from "@/pkg/highlight.js/theme-switcher"
import { ImageCaptionFormat } from "@/pkg/marked/extension/renderer"

export interface MdCustomState {
    imageCaptionFormat: ImageCaptionFormat
    codeBlockTheme: HljsThemeName
    customCss: string
    showLineNumbers: boolean
    fontFamily: string
    fontSize: string
    themeColor: string
    paragraphIndent: string
}

/**
 * @description: 返回 /md 页面自定义配置的默认值.
 * @return 默认配置.
 */
export function getDefaultMdCustomState(): MdCustomState {
    return {
        imageCaptionFormat: ImageCaptionFormat.Alt,
        codeBlockTheme: getDefaultHljsTheme(),
        customCss: "",
        showLineNumbers: true,
        fontFamily: "",
        fontSize: "16px",
        themeColor: "",
        paragraphIndent: "2em",
    }
}

const DEFAULT_STATE: MdCustomState = getDefaultMdCustomState()

/**
 * @description: 判断图注格式是否为受支持的枚举值.
 * @param value 待校验的值.
 * @return 是否为合法图注格式.
 */
function isImageCaptionFormat(value: string | null): value is ImageCaptionFormat {
    return value === ImageCaptionFormat.Alt || value === ImageCaptionFormat.Filename || value === ImageCaptionFormat.None
}

/**
 * @description: 判断代码块主题是否存在于当前 highlight.js 主题列表.
 * @param value 待校验的值.
 * @return 是否为合法主题名.
 */
function isHljsThemeName(value: string | null): value is HljsThemeName {
    return typeof value === "string" && AVAILABLE_HLJS_THEMES.includes(value)
}

/**
 * @description: 从 localStorage 读取 /md 页面自定义配置.
 * @return 读取并校验后的配置.
 */
export function loadMdCustomState(): MdCustomState {
    const storedFormat = localStorage.getItem(LocalStorageKey.MdImageCaptionFormat)
    const imageCaptionFormat = isImageCaptionFormat(storedFormat) ? storedFormat : DEFAULT_STATE.imageCaptionFormat

    const storedTheme = localStorage.getItem(LocalStorageKey.MdCodeBlockTheme)
    const codeBlockTheme = isHljsThemeName(storedTheme) ? storedTheme : DEFAULT_STATE.codeBlockTheme

    const customCss = localStorage.getItem(LocalStorageKey.MdCustomCss) ?? DEFAULT_STATE.customCss

    const lineNumbers = localStorage.getItem(LocalStorageKey.MdShowLineNumbers)
    const showLineNumbers = lineNumbers !== null ? lineNumbers === "true" : DEFAULT_STATE.showLineNumbers

    const fontFamily = localStorage.getItem(LocalStorageKey.MdFontFamily) ?? DEFAULT_STATE.fontFamily
    const storedFontSize = localStorage.getItem(LocalStorageKey.MdFontSize)
    const fontSize = storedFontSize && storedFontSize.trim() ? storedFontSize : DEFAULT_STATE.fontSize
    const themeColor = localStorage.getItem(LocalStorageKey.MdThemeColor) ?? DEFAULT_STATE.themeColor
    const storedParagraphIndent = localStorage.getItem(LocalStorageKey.MdParagraphIndent)
    const paragraphIndent = storedParagraphIndent === "0" ? "0" : DEFAULT_STATE.paragraphIndent

    return {
        imageCaptionFormat,
        codeBlockTheme,
        customCss,
        showLineNumbers,
        fontFamily,
        fontSize,
        themeColor,
        paragraphIndent,
    }
}

/**
 * @description: 将 /md 页面自定义配置按字段写入 localStorage.
 * @param state 需要持久化的配置片段.
 * @return 无返回值.
 */
export function saveMdCustomState(state: Partial<MdCustomState>): void {
    if (state.imageCaptionFormat !== undefined) {
        localStorage.setItem(LocalStorageKey.MdImageCaptionFormat, state.imageCaptionFormat)
    }
    if (state.codeBlockTheme !== undefined) {
        localStorage.setItem(LocalStorageKey.MdCodeBlockTheme, state.codeBlockTheme)
    }
    if (state.customCss !== undefined) {
        localStorage.setItem(LocalStorageKey.MdCustomCss, state.customCss)
    }
    if (state.showLineNumbers !== undefined) {
        localStorage.setItem(LocalStorageKey.MdShowLineNumbers, String(state.showLineNumbers))
    }
    if (state.fontFamily !== undefined) {
        localStorage.setItem(LocalStorageKey.MdFontFamily, state.fontFamily)
    }
    if (state.fontSize !== undefined) {
        localStorage.setItem(LocalStorageKey.MdFontSize, state.fontSize)
    }
    if (state.themeColor !== undefined) {
        localStorage.setItem(LocalStorageKey.MdThemeColor, state.themeColor)
    }
    if (state.paragraphIndent !== undefined) {
        localStorage.setItem(LocalStorageKey.MdParagraphIndent, state.paragraphIndent)
    }
}

/**
 * @description: 清除 /md 页面自定义配置缓存.
 * @return 无返回值.
 */
export function clearMdCustomState(): void {
    localStorage.removeItem(LocalStorageKey.MdImageCaptionFormat)
    localStorage.removeItem(LocalStorageKey.MdCodeBlockTheme)
    localStorage.removeItem(LocalStorageKey.MdCustomCss)
    localStorage.removeItem(LocalStorageKey.MdShowLineNumbers)
    localStorage.removeItem(LocalStorageKey.MdFontFamily)
    localStorage.removeItem(LocalStorageKey.MdFontSize)
    localStorage.removeItem(LocalStorageKey.MdThemeColor)
    localStorage.removeItem(LocalStorageKey.MdParagraphIndent)
}
