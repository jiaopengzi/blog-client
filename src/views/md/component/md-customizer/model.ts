/**
 * @FilePath     : \blog-client\src\views\md\component\md-customizer\model.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * @Description  : /md 自定义弹窗共享配置、选项和纯辅助逻辑
 */

import type { SwitchItem } from "@/components/common/switch-group"

export type MdCustomizerOption = {
    label: string
    value: string
}

export type ThemeColorMode = "default" | "classic-blue" | "vibrant-orange" | "sky-blue" | "custom"

export type ThemeColorPresetOption = {
    key: ThemeColorMode
    label: string
    value: string | null
    previewColor: string | null
}

export const MD_CUSTOM_PRESET_CSS_ID = "md-page-preset-css"
export const MD_CUSTOM_CSS_ID = "md-page-custom-css"

export const FONT_FAMILY_SANS = '"Source Han Sans SC", "Microsoft YaHei", sans-serif'
export const FONT_FAMILY_SERIF = '"Source Han Serif SC", "SimSun", serif'
export const FONT_FAMILY_MONO = '"JBMonoWOFF2", "Cascadia Code", monospace'
export const CUSTOM_THEME_COLOR_FALLBACK = "#0f766e"

export const fontFamilyOptions: MdCustomizerOption[] = [
    { label: "默认", value: "" },
    { label: "无衬线", value: FONT_FAMILY_SANS },
    { label: "有衬线", value: FONT_FAMILY_SERIF },
    { label: "等宽", value: FONT_FAMILY_MONO },
]

export const fontSizeOptions: MdCustomizerOption[] = [
    { label: "小", value: "14px" },
    { label: "中", value: "15px" },
    { label: "常规", value: "16px" },
    { label: "大", value: "18px" },
    { label: "超大", value: "20px" },
]

export const imageCaptionFormatOptions: MdCustomizerOption[] = [
    { label: "alt", value: "alt" },
    { label: "文件名", value: "filename" },
    { label: "不显示", value: "none" },
]

export const themeColorPresetOptions: readonly ThemeColorPresetOption[] = [
    { key: "default", label: "默认", value: "", previewColor: "" },
    { key: "classic-blue", label: "经典蓝", value: "#2563eb", previewColor: "#2563eb" },
    { key: "vibrant-orange", label: "活力橙", value: "#f97316", previewColor: "#f97316" },
    { key: "sky-blue", label: "天空蓝", value: "#38bdf8", previewColor: "#38bdf8" },
    { key: "custom", label: "自定义", value: null, previewColor: null },
]

export const editorHeight = "calc(100% - 36px)"

/**
 * @description: 归一化旧版字体配置, 将历史家族值映射到新的分类选项.
 * @param fontFamily 原始字体配置.
 * @return 归一化后的字体配置.
 */
export function normalizeFontFamily(fontFamily: string): string {
    if (!fontFamily) {
        return ""
    }

    const normalized = fontFamily.toLowerCase()
    if (normalized.includes("mono") || normalized.includes("jbmonowoff2") || normalized.includes("cascadia")) {
        return FONT_FAMILY_MONO
    }
    if (normalized.includes("serif") || normalized.includes("simsun") || normalized.includes("song")) {
        return FONT_FAMILY_SERIF
    }

    return FONT_FAMILY_SANS
}

/**
 * @description: 归一化旧版字号配置, 将不在当前预设中的值回退到常规字号.
 * @param fontSize 原始字号配置.
 * @return 归一化后的字号配置.
 */
export function normalizeFontSize(fontSize: string): string {
    return fontSizeOptions.some((item) => item.value === fontSize) ? fontSize : "16px"
}

/**
 * @description: 根据主题色值推断当前应显示的预设模式.
 * @param themeColor 当前主题色值.
 * @return 主题色模式键.
 */
export function resolveThemeColorMode(themeColor: string): ThemeColorMode {
    if (!themeColor) {
        return "default"
    }

    const matchedPreset = themeColorPresetOptions.find((item) => item.value === themeColor)
    return matchedPreset?.key ?? "custom"
}

/**
 * @description: 获取主题色预设当前应展示的颜色值.
 * @param key 主题色预设键.
 * @param customThemeColor 自定义主题色值.
 * @return 该预设应显示的颜色值, 无颜色时返回空字符串.
 */
export function getThemePresetDisplayColor(key: ThemeColorMode, customThemeColor: string): string {
    if (key === "custom") {
        return customThemeColor
    }

    return themeColorPresetOptions.find((item) => item.key === key)?.previewColor ?? ""
}

/**
 * @description: 生成主题色预设色点样式, 保持按钮内的颜色识别度.
 * @param key 主题色预设键.
 * @param customThemeColor 自定义主题色值.
 * @return 色点的行内样式对象.
 */
export function getThemePresetDotStyle(key: ThemeColorMode, customThemeColor: string): Record<string, string> {
    const color = getThemePresetDisplayColor(key, customThemeColor)

    return {
        background: color || "linear-gradient(135deg, var(--jpz-color-primary), color-mix(in srgb, var(--jpz-color-primary) 45%, white 55%))",
        borderColor: color ? color : "var(--jpz-border-color)",
    }
}

/**
 * @description: 构建段落首行缩进开关项, 复用通用 switch-group 组件.
 * @param enabled 当前是否开启段落首行缩进.
 * @return 段落首行缩进开关项.
 */
export function createParagraphIndentSwitchItems(enabled: boolean): SwitchItem[] {
    return [
        {
            name: "paragraph-indent",
            display: "首行缩进2个字符",
            status: enabled,
            namePosition: "left",
            label: { active: "开", inactive: "关" },
            color: { active: "var(--jpz-color-primary)", inactive: "var(--jpz-text-color-placeholder)" },
            minWidth: 172,
        },
    ]
}

/**
 * @description: 构建代码块行号开关项, 复用通用 switch-group 组件.
 * @param showLineNumbers 当前是否显示代码块行号.
 * @return 代码块行号开关项.
 */
export function createLineNumberSwitchItems(showLineNumbers: boolean): SwitchItem[] {
    return [
        {
            name: "code-line-numbers",
            display: "显示代码块行号",
            status: showLineNumbers,
            namePosition: "left",
            label: { active: "开", inactive: "关" },
            color: { active: "var(--jpz-color-primary)", inactive: "var(--jpz-text-color-placeholder)" },
            minWidth: 196,
        },
    ]
}
