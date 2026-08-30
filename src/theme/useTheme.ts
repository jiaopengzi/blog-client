/*
 * FilePath    : blog-client-nuxt\src\theme\useTheme.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 主题切换相关的组合式函数
 */

/*
 * 补充说明:
 * 迁移自原项目 src/components/hooks/useTheme/index.ts (2025)
 */

import { computed, ref } from "vue"

import { AVAILABLE_HLJS_THEMES, getDefaultHljsTheme, setSiteHljsTheme, type HljsThemeName } from "@/pkg/highlight.js/theme-switcher"
import { getThemeByPreset, ThemeMode } from "@/pkg/codemirror/extension/theme"
import { LocalStorageKey } from "@/stores/local"
import { defaultThemePresetId, getThemePreset, isValidThemePresetId, themePresetList, type ThemePresetId, type ThemeScheme } from "@/theme/presets"

import { applyThemePresetToDocument } from "@/theme/runtime"

/**
 * 读取本地缓存的主题预设, 无效值回退到默认主题.
 * @returns 当前可用的主题预设 ID.
 */
function readStoredThemePreset(): ThemePresetId {
    if (typeof localStorage === "undefined") {
        return defaultThemePresetId
    }

    const storedValue = localStorage.getItem(LocalStorageKey.ThemePreset)
    if (!storedValue || !isValidThemePresetId(storedValue)) {
        return defaultThemePresetId
    }

    return storedValue
}

/**
 * @description: 读取主站缓存的代码块主题, 无效值回退到默认主题.
 * @return 当前可用的代码块主题名称.
 */
function readStoredSiteCodeBlockTheme(): HljsThemeName {
    if (typeof localStorage === "undefined") {
        return getDefaultHljsTheme()
    }

    const storedValue = localStorage.getItem(LocalStorageKey.SiteCodeBlockTheme)
    if (!storedValue || !AVAILABLE_HLJS_THEMES.includes(storedValue)) {
        return getDefaultHljsTheme()
    }

    return storedValue
}

// 当前主题预设 ID 的响应式状态。导出供 app.vue 的 useHead 主题样式 getter 订阅
// (SSR 直出 + 客户端切换预设时原位更新 theme-preset-style 内容, 260828 顺序修复)
export const activeThemePresetState = ref<ThemePresetId>(readStoredThemePreset())
const activeSiteCodeBlockThemeState = ref<HljsThemeName>(readStoredSiteCodeBlockTheme())

/**
 * 当前主题预设的明暗 scheme, 响应式派生自 activeThemePresetState.
 * 供 app.vue 的 useHead htmlAttrs.class 使用: 若 useHead 静态写入 class="light",
 * 客户端水合时 unhead 会把 "light" 重新加回 documentElement, 与运行时主题类叠加成
 * "dark light", 使 html.light 规则 (如 lightningcss 的 color-scheme 规则) 在暗色下误命中,
 * 与线上旧站 (仅 "dark") 不一致. 这里改为响应式取值, 水合与主题切换时始终与运行时一致.
 */
export const activeThemeSchemeState = computed<ThemeScheme>(() => getThemePreset(activeThemePresetState.value).scheme)

if (typeof document !== "undefined") {
    applyThemePresetToDocument(getThemePreset(activeThemePresetState.value))
    void setSiteHljsTheme(activeSiteCodeBlockThemeState.value)
}

/**
 * 持久化主题预设并立即同步到文档根节点.
 * @param presetId 需要保存并应用的主题预设.
 */
function persistThemePreset(presetId: ThemePresetId) {
    activeThemePresetState.value = presetId
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(LocalStorageKey.ThemePreset, presetId)
    }
    applyThemePresetToDocument(getThemePreset(presetId))
}

/**
 * @description: 持久化主站代码块主题并立即同步到当前文档.
 * @param themeName 需要保存并应用的代码块主题.
 * @return 无返回值.
 */
function persistSiteCodeBlockTheme(themeName: HljsThemeName): void {
    activeSiteCodeBlockThemeState.value = themeName
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(LocalStorageKey.SiteCodeBlockTheme, themeName)
    }
    void setSiteHljsTheme(themeName)
}

/**
 * 主题域统一入口, 负责前台主题状态、预设选择与编辑器主题联动.
 * @returns 主题状态、可选预设以及主题切换方法.
 */
export function useTheme() {
    const activeThemePreset = computed<ThemePresetId>({
        get: () => activeThemePresetState.value,
        set: (presetId) => {
            persistThemePreset(presetId)
        },
    })

    const themePresetOptions = computed(() => themePresetList)
    const codeBlockThemeOptions = computed(() => [...AVAILABLE_HLJS_THEMES])
    const activeSiteCodeBlockTheme = computed<HljsThemeName>({
        get: () => activeSiteCodeBlockThemeState.value,
        set: (themeName) => {
            persistSiteCodeBlockTheme(themeName)
        },
    })

    const activeTheme = computed(() => getThemePreset(activeThemePreset.value))

    const isDark = computed(() => activeTheme.value.scheme === "dark")

    const selectThemePreset = (presetId: ThemePresetId) => {
        activeThemePreset.value = presetId
    }

    /**
     * @description: 选择并应用主站代码块主题.
     * @param themeName 目标主题名称.
     * @return 无返回值.
     */
    const selectSiteCodeBlockTheme = (themeName: HljsThemeName): void => {
        activeSiteCodeBlockTheme.value = themeName
    }

    const theme = computed(() => {
        const mode = isDark.value ? ThemeMode.Dark : ThemeMode.Light
        return getThemeByPreset(activeThemePreset.value, mode)
    })

    return {
        activeTheme,
        activeSiteCodeBlockTheme,
        activeThemePreset,
        codeBlockThemeOptions,
        isDark,
        selectSiteCodeBlockTheme,
        selectThemePreset,
        theme,
        themePresetOptions,
    }
}
