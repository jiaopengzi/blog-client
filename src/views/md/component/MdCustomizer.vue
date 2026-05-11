<template>
    <Teleport to="body">
        <div v-if="visible" class="md-customizer-overlay" @click.self="close">
            <div class="md-customizer-panel">
                <header class="md-customizer-header">
                    <div>
                        <p class="md-customizer-eyebrow">/md 局部样式</p>
                        <h2 class="md-customizer-title">页面自定义</h2>
                    </div>
                    <button type="button" class="md-customizer-close" aria-label="关闭" @click="close">&times;</button>
                </header>

                <div class="md-customizer-body">
                    <aside class="md-customizer-config">
                        <div class="md-customizer-actions">
                            <el-button class="md-customizer-reset-btn" type="danger" plain @click="resetAll">重置全部设置</el-button>
                        </div>

                        <section class="md-customizer-section">
                            <p class="md-customizer-section-title">视觉</p>

                            <div class="md-customizer-group">
                                <label class="md-customizer-label">主题色</label>
                                <div class="md-customizer-theme-grid">
                                    <button
                                        v-for="preset in themeColorPresetOptions"
                                        :key="preset.key"
                                        type="button"
                                        class="md-customizer-theme-option"
                                        :class="{ 'is-active': themeColorMode === preset.key, 'is-neutral': !getThemePresetDisplayColor(preset.key) }"
                                        :aria-pressed="themeColorMode === preset.key"
                                        @click="onThemeColorModeChanged(preset.key)"
                                    >
                                        <span class="md-customizer-theme-option__dot" :style="getThemePresetDotStyle(preset.key)"></span>
                                        <span>{{ preset.label }}</span>
                                    </button>
                                </div>
                                <div v-if="themeColorMode === 'custom'" class="md-customizer-color-row">
                                    <el-color-picker
                                        v-model="customThemeColor"
                                        popper-class="md-customizer-popper md-customizer-color-popper"
                                        @change="onCustomThemeColorChanged"
                                    />
                                    <span class="md-customizer-color-value">{{ customThemeColor }}</span>
                                </div>
                            </div>

                            <div class="md-customizer-group">
                                <label class="md-customizer-label">代码块主题</label>
                                <el-select
                                    v-model="localState.codeBlockTheme"
                                    placeholder="选择主题"
                                    filterable
                                    popper-class="md-customizer-popper"
                                    @change="onSettingChanged"
                                >
                                    <el-option v-for="t in availableThemes" :key="t" :label="t" :value="t" />
                                </el-select>
                            </div>

                            <div class="md-customizer-group">
                                <div class="md-customizer-switch-wrap">
                                    <SwitchGroup :switch-items="lineNumberSwitchItems" @update-status="onLineNumberSwitchUpdated" />
                                </div>
                            </div>
                        </section>

                        <section class="md-customizer-section">
                            <p class="md-customizer-section-title">排版</p>

                            <div class="md-customizer-group">
                                <label class="md-customizer-label">字体</label>
                                <el-radio-group v-model="localState.fontFamily" class="md-customizer-radio-group" @change="onSettingChanged">
                                    <el-radio-button v-for="f in fontFamilyOptions" :key="f.value || f.label" :label="f.value">
                                        {{ f.label }}
                                    </el-radio-button>
                                </el-radio-group>
                            </div>

                            <div class="md-customizer-group">
                                <label class="md-customizer-label">字号</label>
                                <el-radio-group v-model="localState.fontSize" class="md-customizer-radio-group" @change="onSettingChanged">
                                    <el-radio-button v-for="s in fontSizeOptions" :key="s.value" :label="s.value">
                                        {{ s.label }}
                                    </el-radio-button>
                                </el-radio-group>
                            </div>

                            <div class="md-customizer-group">
                                <div class="md-customizer-switch-wrap">
                                    <SwitchGroup :switch-items="paragraphIndentSwitchItems" @update-status="onParagraphIndentSwitchUpdated" />
                                </div>
                            </div>
                        </section>

                        <section class="md-customizer-section">
                            <p class="md-customizer-section-title">图片</p>

                            <div class="md-customizer-group">
                                <label class="md-customizer-label">图注格式</label>
                                <el-radio-group v-model="localState.imageCaptionFormat" class="md-customizer-radio-group" @change="onSettingChanged">
                                    <el-radio-button label="alt">alt</el-radio-button>
                                    <el-radio-button label="filename">文件名</el-radio-button>
                                    <el-radio-button label="none">不显示</el-radio-button>
                                </el-radio-group>
                            </div>
                        </section>
                    </aside>

                    <main class="md-customizer-editor">
                        <div class="md-customizer-editor-header">
                            <div>
                                <span class="md-customizer-editor-label">自定义 CSS</span>
                                <p class="md-customizer-editor-tip">左侧配置会同步到自动生成区, 你可以继续在下方手动补充.</p>
                            </div>
                            <el-button size="small" text @click="insertCssExample">插入示例</el-button>
                        </div>
                        <div class="md-customizer-editor-wrap">
                            <EditorCodemirror
                                ref="editorRef"
                                :create-setup="createCssSetup"
                                :doc="editorDoc"
                                :height="editorHeight"
                                :init-doc-is-empty="false"
                                @update-editor-doc="onEditorDocChange"
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue"

import SwitchGroup, { type SwitchItem } from "@/components/common/switch-group"
import EditorCodemirror from "@/components/editor/components/codemirror/index.vue"
import { ImageCaptionFormat, setImageCaptionFormat } from "@/pkg/marked/extension/renderer"
import { AVAILABLE_HLJS_THEMES, type HljsThemeName, setHljsTheme } from "@/pkg/highlight.js/theme-switcher"
import { createCssSetup } from "@/pkg/codemirror"
import { clearMdCustomState, getDefaultMdCustomState, type MdCustomState, loadMdCustomState, saveMdCustomState } from "@/stores/md-custom"
import { removeCommentsSafe } from "@/utils/cssValidator"
import { scopeCssToSelector, scopeCustomThemeCss } from "@/utils/style"

import { buildMdCustomizerEditorDoc, buildMdPresetCss, extractMdCustomUserCss, getMdCustomCssExample, MD_PREVIEW_SCOPE_SELECTOR } from "./customize-style"

const MD_CUSTOM_PRESET_CSS_ID = "md-page-preset-css"
const MD_CUSTOM_CSS_ID = "md-page-custom-css"

const props = defineProps<{
    visible: boolean
}>()

const emit = defineEmits<{
    (e: "update:visible", value: boolean): void
    (e: "settings-changed"): void
}>()

const editorRef = ref<InstanceType<typeof EditorCodemirror> | null>(null)
const editorDoc = ref("")
const renderedEditorDoc = ref("")

const FONT_FAMILY_SANS = '"Source Han Sans SC", "Microsoft YaHei", sans-serif'
const FONT_FAMILY_SERIF = '"Source Han Serif SC", "SimSun", serif'
const FONT_FAMILY_MONO = '"JBMonoWOFF2", "Cascadia Code", monospace'
const CUSTOM_THEME_COLOR_FALLBACK = "#0f766e"

const fontFamilyOptions = [
    { label: "默认", value: "" },
    { label: "无衬线", value: FONT_FAMILY_SANS },
    { label: "有衬线", value: FONT_FAMILY_SERIF },
    { label: "等宽", value: FONT_FAMILY_MONO },
]

const fontSizeOptions = [
    { label: "小", value: "14px" },
    { label: "中", value: "15px" },
    { label: "常规", value: "16px" },
    { label: "大", value: "18px" },
    { label: "超大", value: "20px" },
]

const themeColorPresetOptions = [
    { key: "default", label: "默认", value: "", previewColor: "" },
    { key: "classic-blue", label: "经典蓝", value: "#2563eb", previewColor: "#2563eb" },
    { key: "vibrant-orange", label: "活力橙", value: "#f97316", previewColor: "#f97316" },
    { key: "sky-blue", label: "天空蓝", value: "#38bdf8", previewColor: "#38bdf8" },
    { key: "custom", label: "自定义", value: null, previewColor: null },
] as const

const availableThemes = [...AVAILABLE_HLJS_THEMES]

const editorHeight = "calc(100% - 36px)"

const localState = reactive<MdCustomState>(getDefaultMdCustomState())
const themeColorMode = ref<(typeof themeColorPresetOptions)[number]["key"]>("default")
const customThemeColor = ref(CUSTOM_THEME_COLOR_FALLBACK)

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
    return [
        {
            name: "paragraph-indent",
            display: "首行缩进2个字符",
            status: isParagraphIndentEnabled.value,
            namePosition: "left",
            label: { active: "开", inactive: "关" },
            color: { active: "var(--jpz-color-primary)", inactive: "var(--jpz-text-color-placeholder)" },
            minWidth: 172,
        },
    ]
})

/**
 * @description: 构建代码块行号开关项, 复用通用 switch-group 组件.
 * @return 代码块行号开关项.
 */
const lineNumberSwitchItems = computed<SwitchItem[]>(() => {
    return [
        {
            name: "code-line-numbers",
            display: "显示代码块行号",
            status: localState.showLineNumbers,
            namePosition: "left",
            label: { active: "开", inactive: "关" },
            color: { active: "var(--jpz-color-primary)", inactive: "var(--jpz-text-color-placeholder)" },
            minWidth: 196,
        },
    ]
})

/**
 * @description: 归一化旧版字体配置, 将历史家族值映射到新的分类选项.
 * @param fontFamily 原始字体配置.
 * @return 归一化后的字体配置.
 */
function normalizeFontFamily(fontFamily: string): string {
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
function normalizeFontSize(fontSize: string): string {
    return fontSizeOptions.some((item) => item.value === fontSize) ? fontSize : "16px"
}

/**
 * @description: 根据主题色值推断当前应显示的预设模式.
 * @param themeColor 当前主题色值.
 * @return 主题色模式键.
 */
function resolveThemeColorMode(themeColor: string): (typeof themeColorPresetOptions)[number]["key"] {
    if (!themeColor) {
        return "default"
    }

    const matchedPreset = themeColorPresetOptions.find((item) => item.value === themeColor)
    return matchedPreset?.key ?? "custom"
}

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
 * @description: 获取主题色预设当前应展示的颜色值.
 * @param key 主题色预设键.
 * @return 该预设应显示的颜色值, 无颜色时返回空字符串.
 */
function getThemePresetDisplayColor(key: (typeof themeColorPresetOptions)[number]["key"]): string {
    if (key === "custom") {
        return customThemeColor.value
    }

    return themeColorPresetOptions.find((item) => item.key === key)?.previewColor ?? ""
}

/**
 * @description: 生成主题色预设色点样式, 保持按钮内的颜色识别度.
 * @param key 主题色预设键.
 * @return 色点的行内样式对象.
 */
function getThemePresetDotStyle(key: (typeof themeColorPresetOptions)[number]["key"]): Record<string, string> {
    const color = getThemePresetDisplayColor(key)
    return {
        background: color || "linear-gradient(135deg, var(--jpz-color-primary), color-mix(in srgb, var(--jpz-color-primary) 45%, white 55%))",
        borderColor: color ? color : "var(--jpz-border-color)",
    }
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

    void nextTick(() => {
        editorRef.value?.replaceContent(nextDoc)
    })
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
function onThemeColorModeChanged(mode: (typeof themeColorPresetOptions)[number]["key"]): void {
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
    const nextCustomCss = localState.customCss.trim() ? `${localState.customCss.trim()}\n\n${getMdCustomCssExample()}` : getMdCustomCssExample()

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

.md-customizer-config {
    padding: 20px 18px 24px;
    overflow-y: auto;
    border-right: 1px solid var(--jpz-border-color);
    background: color-mix(in srgb, var(--jpz-bg-color-page) 92%, var(--jpz-bg-color) 8%);
}

.md-customizer-section {
    margin-bottom: 18px;
    padding: 18px;
    border: 1px solid color-mix(in srgb, var(--jpz-border-color) 78%, transparent);
    border-radius: 14px;
    background: color-mix(in srgb, var(--jpz-bg-color) 92%, transparent);
    box-shadow: inset 0 1px 0 color-mix(in srgb, white 24%, transparent);
}

.md-customizer-section-title {
    margin: 0 0 14px;
    color: var(--jpz-text-color-primary);
    font-size: 13px;
    font-weight: 700;
}

.md-customizer-actions {
    margin-bottom: 18px;
}

.md-customizer-reset-btn {
    width: 100%;
    min-height: 42px;
    border-radius: 12px;
}

.md-customizer-group + .md-customizer-group {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid color-mix(in srgb, var(--jpz-border-color) 72%, transparent);
}

.md-customizer-label {
    display: block;
    margin-bottom: 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--jpz-text-color-regular);
}

.md-customizer-theme-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.md-customizer-theme-option {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 42px;
    padding: 0 12px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 12px;
    background: color-mix(in srgb, var(--jpz-bg-color) 96%, white 4%);
    color: var(--jpz-text-color-primary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition:
        transform 0.18s ease,
        border-color 0.18s ease,
        background-color 0.18s ease,
        box-shadow 0.18s ease,
        color 0.18s ease;

    &:hover {
        transform: translateY(-1px);
    }

    &.is-active {
        transform: translateY(-1px);
        border-color: var(--jpz-color-primary);
        background: color-mix(in srgb, var(--jpz-color-primary) 10%, var(--jpz-bg-color) 90%);
        box-shadow: 0 10px 24px color-mix(in srgb, var(--jpz-color-primary) 16%, transparent);
    }
}

.md-customizer-theme-option__dot {
    width: 12px;
    height: 12px;
    border: 1px solid transparent;
    border-radius: 999px;
    flex-shrink: 0;
}

.md-customizer-color-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
}

.md-customizer-color-value {
    color: var(--jpz-text-color-secondary);
    font-size: 12px;
}

.md-customizer-radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    :deep(.el-radio-button__inner) {
        min-width: 64px;
        border: 1px solid var(--jpz-border-color);
        border-radius: 10px;
        box-shadow: none;
    }

    :deep(.el-radio-button:first-child .el-radio-button__inner),
    :deep(.el-radio-button:last-child .el-radio-button__inner) {
        border-radius: 10px;
    }

    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
        border-color: var(--jpz-color-primary);
        box-shadow: none;
    }
}

.md-customizer-switch-wrap {
    padding: 10px 12px;
    border: 1px solid color-mix(in srgb, var(--jpz-border-color) 80%, transparent);
    border-radius: 12px;
    background: color-mix(in srgb, var(--jpz-bg-color) 95%, white 5%);

    :deep(.switch-group) {
        width: 100%;
    }

    :deep(.switch-item) {
        width: 100%;
        justify-content: space-between;
    }

    :deep(.display) {
        margin-right: 12px;
        color: var(--jpz-text-color-secondary);
        font-size: 13px;
    }
}

.md-customizer-editor {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

.md-customizer-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 20px 10px;
    flex-shrink: 0;
}

.md-customizer-editor-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--jpz-text-color-regular);
}

.md-customizer-editor-tip {
    margin: 4px 0 0;
    color: var(--jpz-text-color-secondary);
    font-size: 12px;
    line-height: 1.5;
}

.md-customizer-editor-wrap {
    flex: 1;
    min-height: 0;
    padding: 0 12px 12px;
    overflow: hidden;

    :deep(#jpz-codemirror) {
        height: 100% !important;
    }

    :deep(.cm-editor) {
        height: 100% !important;
        border-radius: 12px;
        border: 1px solid var(--jpz-border-color);
        background: color-mix(in srgb, var(--jpz-bg-color) 96%, white 4%);
    }

    :deep(.cm-scroller) {
        overflow: auto !important;
    }
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

    .md-customizer-theme-grid {
        grid-template-columns: 1fr;
    }

    .md-customizer-config {
        border-right: none;
        border-bottom: 1px solid var(--jpz-border-color);
    }

    .md-customizer-editor-header {
        align-items: flex-start;
        flex-direction: column;
    }
}

:global(.md-customizer-popper) {
    z-index: 10010 !important;
}

:global(.md-customizer-color-popper .el-color-dropdown) {
    z-index: 10010 !important;
}
</style>
