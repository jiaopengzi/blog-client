<!--
 * FilePath    : blog-client\src\views\md\component\md-customizer\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页面自定义弹窗组件，包含配置面板和 CSS 编辑器面板两个子组件. 
-->

<template>
    <Teleport to="body">
        <div v-if="visible" class="md-customizer-overlay" @click.self="close">
            <div class="md-customizer-panel">
                <header class="md-customizer-header">
                    <div>
                        <h2 class="md-customizer-title">样式自定义</h2>
                    </div>
                    <button type="button" class="md-customizer-close" aria-label="关闭" @click="close">&times;</button>
                </header>

                <div class="md-customizer-body">
                    <MdCustomizerConfigPanel
                        :available-themes="availableThemes"
                        :custom-theme-color="customThemeColor"
                        :font-family-options="fontFamilyOptions"
                        :font-size-options="fontSizeOptions"
                        :line-number-switch-items="lineNumberSwitchItems"
                        :local-state="localState"
                        :paragraph-indent-switch-items="paragraphIndentSwitchItems"
                        :theme-color-mode="themeColorMode"
                        :theme-color-preset-options="themeColorPresetOptions"
                        @setting-changed="onSettingChanged"
                        @theme-color-mode-changed="onThemeColorModeChanged"
                        @custom-theme-color-changed="onCustomThemeColorChanged"
                        @line-number-switch-updated="onLineNumberSwitchUpdated"
                        @paragraph-indent-switch-updated="onParagraphIndentSwitchUpdated"
                        @reset="resetAll"
                    />

                    <MdCustomizerEditorPanel
                        :doc="editorDoc"
                        :editor-height="editorHeight"
                        @update-editor-doc="onEditorDocChange"
                        @insert-css-example="insertCssExample"
                    />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue"

import type { SwitchItem } from "@/components/common/switch-group"
import { ImageCaptionFormat, setImageCaptionFormat } from "@/pkg/marked/extension/renderer"
import { type HljsThemeName, setHljsTheme } from "@/pkg/highlight.js/theme-switcher"
import { clearMdCustomState, getDefaultMdCustomState, type MdCustomState, loadMdCustomState, saveMdCustomState } from "@/stores/md-custom"
import { cssExample } from "@/utils/cssExample"
import { removeCommentsSafe } from "@/utils/cssValidator"
import { scopeCssToSelector, scopeCustomThemeCss } from "@/utils/style"

import { buildMdCustomizerEditorDoc, buildMdPresetCss, extractMdCustomUserCss, MD_PREVIEW_SCOPE_SELECTOR } from "../customize-style"
import {
    availableThemes,
    createLineNumberSwitchItems,
    createParagraphIndentSwitchItems,
    CUSTOM_THEME_COLOR_FALLBACK,
    editorHeight,
    fontFamilyOptions,
    fontSizeOptions,
    MD_CUSTOM_CSS_ID,
    MD_CUSTOM_PRESET_CSS_ID,
    normalizeFontFamily,
    normalizeFontSize,
    resolveThemeColorMode,
    themeColorPresetOptions,
    type ThemeColorMode,
} from "./model"
import MdCustomizerConfigPanel from "./config-panel"
import MdCustomizerEditorPanel from "./editor-panel"

defineOptions({ name: "MdCustomizer" })

const props = defineProps<{
    visible: boolean
}>()

const emit = defineEmits<{
    (e: "update:visible", value: boolean): void
    (e: "settings-changed"): void
}>()

const localState = reactive<MdCustomState>(getDefaultMdCustomState())
const themeColorMode = ref<ThemeColorMode>("default")
const customThemeColor = ref(CUSTOM_THEME_COLOR_FALLBACK)
const editorDoc = ref("")
const renderedEditorDoc = ref("")

const isParagraphIndentEnabled = computed({
    get: () => localState.paragraphIndent !== "0",
    set: (enabled: boolean) => {
        localState.paragraphIndent = enabled ? "2em" : "0"
    },
})

/**
 * @description: 构建段落首行缩进开关项, 复用通用 switch-group 组件.
 * @return 段落首行缩进开关项.
 */
const paragraphIndentSwitchItems = computed<SwitchItem[]>(() => {
    return createParagraphIndentSwitchItems(isParagraphIndentEnabled.value)
})

/**
 * @description: 构建代码块行号开关项, 复用通用 switch-group 组件.
 * @return 代码块行号开关项.
 */
const lineNumberSwitchItems = computed<SwitchItem[]>(() => {
    return createLineNumberSwitchItems(localState.showLineNumbers)
})

/**
 * @description: 将当前本地状态归一化到最新的面板模型.
 * @return 无返回值.
 */
function normalizeLocalState(): void {
    localState.fontFamily = normalizeFontFamily(localState.fontFamily)
    localState.fontSize = normalizeFontSize(localState.fontSize)
    localState.paragraphIndent = localState.paragraphIndent === "0" ? "0" : "2em"

    themeColorMode.value = resolveThemeColorMode(localState.themeColor)
    customThemeColor.value = themeColorMode.value === "custom" && localState.themeColor ? localState.themeColor : CUSTOM_THEME_COLOR_FALLBACK
}

/**
 * @description: 关闭自定义弹窗.
 * @return 无返回值.
 */
function close(): void {
    emit("update:visible", false)
}

/**
 * @description: 在 head 中写入指定样式标签.
 * @param styleId 样式标签 ID.
 * @param cssContent 最终要写入的 CSS 文本.
 * @return 无返回值.
 */
function setHeadStyle(styleId: string, cssContent: string): void {
    document.getElementById(styleId)?.remove()

    const trimmedCss = cssContent.trim()
    if (!trimmedCss) {
        return
    }

    const style = document.createElement("style")
    style.id = styleId
    style.textContent = trimmedCss
    document.head.appendChild(style)
}

/**
 * @description: 从 localStorage 读取当前 /md 页面自定义配置并回填到本地状态.
 * @return 无返回值.
 */
function loadState(): void {
    Object.assign(localState, loadMdCustomState())
    normalizeLocalState()
}

/**
 * @description: 同步右侧编辑器中的完整 CSS 文档.
 * @return 无返回值.
 */
function syncEditorDoc(): void {
    const nextDoc = buildMdCustomizerEditorDoc(localState)
    editorDoc.value = nextDoc
    renderedEditorDoc.value = nextDoc
}

/**
 * @description: 将左侧配置对应的预设样式注入到 /md 预览区.
 * @return 无返回值.
 */
function applyPresetCss(): void {
    setHeadStyle(MD_CUSTOM_PRESET_CSS_ID, buildMdPresetCss(localState))
}

/**
 * @description: 将右侧编辑器中的手动 CSS 作用域限制到 /md 预览区并注入页面.
 * @return 无返回值.
 */
function applyCustomCss(): void {
    const normalizedCss = scopeCssToSelector(scopeCustomThemeCss(removeCommentsSafe(localState.customCss)), MD_PREVIEW_SCOPE_SELECTOR)
    setHeadStyle(MD_CUSTOM_CSS_ID, normalizedCss)
}

/**
 * @description: 将当前配置写回 localStorage.
 * @return 无返回值.
 */
function persistState(): void {
    saveMdCustomState({ ...localState })
}

/**
 * @description: 应用非 CSS 配置, 包括图注格式和代码块主题.
 * @return 无返回值.
 */
async function applyNonCssSettings(): Promise<void> {
    setImageCaptionFormat(localState.imageCaptionFormat as ImageCaptionFormat)
    await setHljsTheme(localState.codeBlockTheme as HljsThemeName)
}

/**
 * @description: 应用当前全部 /md 自定义设置.
 * @param options 是否同步编辑器文本与是否通知外层重渲染.
 * @return 无返回值.
 */
async function applyAllSettings(options: { syncEditor?: boolean; emitChange?: boolean } = {}): Promise<void> {
    await applyNonCssSettings()
    applyPresetCss()
    applyCustomCss()
    persistState()

    if (options.syncEditor) {
        syncEditorDoc()
    }
    if (options.emitChange) {
        emit("settings-changed")
    }
}

/**
 * @description: 处理左侧控件变更.
 * @return 无返回值.
 */
async function onSettingChanged(): Promise<void> {
    await applyAllSettings({ syncEditor: true, emitChange: true })
}

/**
 * @description: 同步段落首行缩进开关状态到本地配置.
 * @param items switch-group 返回的开关项数组.
 * @return 无返回值.
 */
function onParagraphIndentSwitchUpdated(items: SwitchItem[]): void {
    isParagraphIndentEnabled.value = Boolean(items[0]?.status)
    void onSettingChanged()
}

/**
 * @description: 同步代码块行号开关状态到本地配置.
 * @param items switch-group 返回的开关项数组.
 * @return 无返回值.
 */
function onLineNumberSwitchUpdated(items: SwitchItem[]): void {
    localState.showLineNumbers = Boolean(items[0]?.status)
    void onSettingChanged()
}

/**
 * @description: 处理主题色模式切换.
 * @param mode 当前选中的主题色模式.
 * @return 无返回值.
 */
function onThemeColorModeChanged(mode: ThemeColorMode): void {
    const matchedPreset = themeColorPresetOptions.find((item) => item.key === mode)

    if (!matchedPreset) {
        return
    }

    themeColorMode.value = mode

    if (mode === "custom") {
        localState.themeColor = customThemeColor.value || CUSTOM_THEME_COLOR_FALLBACK
    } else {
        localState.themeColor = matchedPreset.value ?? ""
    }

    void onSettingChanged()
}

/**
 * @description: 处理自定义主题色变更并同步到当前本地状态.
 * @param value 颜色选择器返回的颜色值.
 * @return 无返回值.
 */
function onCustomThemeColorChanged(value: string | null): void {
    customThemeColor.value = value || CUSTOM_THEME_COLOR_FALLBACK
    localState.themeColor = customThemeColor.value
    void onSettingChanged()
}

/**
 * @description: 处理右侧编辑器文本变更, 仅提取用户自定义区并注入页面.
 * @param doc 编辑器中的完整 CSS 文档.
 * @return 无返回值.
 */
function onEditorDocChange(doc: string): void {
    if (doc === renderedEditorDoc.value) {
        return
    }

    editorDoc.value = doc

    const nextCustomCss = extractMdCustomUserCss(doc)
    if (nextCustomCss === localState.customCss) {
        return
    }

    localState.customCss = nextCustomCss
    saveMdCustomState({ customCss: nextCustomCss })
    applyCustomCss()
    emit("settings-changed")
}

/**
 * @description: 向手动区插入 /md 预览样式示例.
 * @return 无返回值.
 */
function insertCssExample(): void {
    const nextCustomCss = localState.customCss.trim() ? `${localState.customCss.trim()}\n\n${cssExample()}` : cssExample()

    localState.customCss = nextCustomCss
    applyCustomCss()
    saveMdCustomState({ customCss: nextCustomCss })
    syncEditorDoc()
    emit("settings-changed")
}

/**
 * @description: 重置 /md 页面全部自定义配置.
 * @return 无返回值.
 */
function resetAll(): void {
    clearMdCustomState()
    Object.assign(localState, getDefaultMdCustomState())
    normalizeLocalState()
    applyCustomCss()
    void applyAllSettings({ syncEditor: true, emitChange: true })
}

watch(
    () => props.visible,
    (val) => {
        if (val) {
            loadState()
            void applyAllSettings({ syncEditor: true, emitChange: false })
        }
    },
)

onMounted(() => {
    loadState()
    syncEditorDoc()
    void applyAllSettings({ emitChange: false })
})
</script>

<style lang="scss" scoped>
.md-customizer-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
}

.md-customizer-panel {
    display: flex;
    flex-direction: column;
    width: min(1120px, 96vw);
    max-height: 90vh;
    border: 1px solid color-mix(in srgb, var(--jpz-border-color) 72%, transparent);
    border-radius: 20px;
    background:
        radial-gradient(circle at top left, color-mix(in srgb, var(--jpz-color-primary) 12%, transparent) 0%, transparent 36%),
        linear-gradient(180deg, color-mix(in srgb, var(--jpz-bg-color) 96%, white 4%) 0%, var(--jpz-bg-color) 100%);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.md-customizer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--jpz-border-color);
    flex-shrink: 0;
}

.md-customizer-eyebrow {
    margin: 0 0 6px;
    color: var(--jpz-color-primary);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.md-customizer-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--jpz-text-color-primary);
}

.md-customizer-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 6px;
    background: transparent;
    font-size: 22px;
    color: var(--jpz-text-color-secondary);
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: var(--jpz-bg-color-page);
    }
}

.md-customizer-body {
    display: grid;
    grid-template-columns: 320px 1fr;
    min-height: 0;
    flex: 1;
    overflow: hidden;
}

@include respond-to("phone") {
    .md-customizer-panel {
        width: min(100vw, 100vw);
        max-height: 100vh;
        border-radius: 0;
    }

    .md-customizer-body {
        grid-template-columns: 1fr;
    }
}
</style>
