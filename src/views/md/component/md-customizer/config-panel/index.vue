<!--
 * FilePath    : blog-client\src\views\md\component\md-customizer\config-panel\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页面自定义配置面板组件，包含视觉、排版和图片三个配置项分类. 
-->

<template>
    <aside class="md-customizer-config">
        <div class="md-customizer-actions">
            <el-button class="md-customizer-reset-btn" type="danger" plain @click="emitReset">重置全部设置</el-button>
        </div>

        <MdCustomizerVisualSection
            :custom-theme-color="customThemeColor"
            :line-number-switch-items="lineNumberSwitchItems"
            :local-state="localState"
            :theme-color-mode="themeColorMode"
            :theme-color-preset-options="themeColorPresetOptions"
            @theme-color-mode-changed="emitThemeColorModeChanged"
            @custom-theme-color-changed="emitCustomThemeColorChanged"
            @line-number-switch-updated="emitLineNumberSwitchUpdated"
        />

        <MdCustomizerTypographySection
            :font-family-options="fontFamilyOptions"
            :font-size-options="fontSizeOptions"
            :local-state="localState"
            :paragraph-indent-switch-items="paragraphIndentSwitchItems"
            @setting-changed="emitSettingChanged"
            @paragraph-indent-switch-updated="emitParagraphIndentSwitchUpdated"
        />

        <MdCustomizerImageSection :local-state="localState" @setting-changed="emitSettingChanged" />
    </aside>
</template>

<script lang="ts" setup>
import type { SwitchItem } from "@/components/common/switch-group"
import type { MdCustomState } from "@/stores/md-custom"

import type { MdCustomizerOption, ThemeColorMode, ThemeColorPresetOption } from "../model"
import MdCustomizerImageSection from "./image-section"
import MdCustomizerTypographySection from "./typography-section"
import MdCustomizerVisualSection from "./visual-section"

defineOptions({ name: "MdCustomizerConfigPanel" })

defineProps<{
    customThemeColor: string
    fontFamilyOptions: MdCustomizerOption[]
    fontSizeOptions: MdCustomizerOption[]
    lineNumberSwitchItems: SwitchItem[]
    localState: MdCustomState
    paragraphIndentSwitchItems: SwitchItem[]
    themeColorMode: ThemeColorMode
    themeColorPresetOptions: ReadonlyArray<ThemeColorPresetOption>
}>()

const emit = defineEmits<{
    (event: "setting-changed"): void
    (event: "theme-color-mode-changed", mode: ThemeColorMode): void
    (event: "custom-theme-color-changed", value: string | null): void
    (event: "line-number-switch-updated", items: SwitchItem[]): void
    (event: "paragraph-indent-switch-updated", items: SwitchItem[]): void
    (event: "reset"): void
}>()

/**
 * @description: 通知容器层重新应用左侧配置.
 * @return 无返回值.
 */
function emitSettingChanged(): void {
    emit("setting-changed")
}

/**
 * @description: 通知容器层切换主题色模式.
 * @param mode 当前选中的主题色模式键.
 * @return 无返回值.
 */
function emitThemeColorModeChanged(mode: ThemeColorMode): void {
    emit("theme-color-mode-changed", mode)
}

/**
 * @description: 通知容器层更新自定义主题色.
 * @param value 颜色选择器返回的颜色值.
 * @return 无返回值.
 */
function emitCustomThemeColorChanged(value: string | null): void {
    emit("custom-theme-color-changed", value)
}

/**
 * @description: 通知容器层同步代码块行号开关状态.
 * @param items switch-group 返回的开关项数组.
 * @return 无返回值.
 */
function emitLineNumberSwitchUpdated(items: SwitchItem[]): void {
    emit("line-number-switch-updated", items)
}

/**
 * @description: 通知容器层同步段落首行缩进开关状态.
 * @param items switch-group 返回的开关项数组.
 * @return 无返回值.
 */
function emitParagraphIndentSwitchUpdated(items: SwitchItem[]): void {
    emit("paragraph-indent-switch-updated", items)
}

/**
 * @description: 通知容器层重置全部自定义配置.
 * @return 无返回值.
 */
function emitReset(): void {
    emit("reset")
}
</script>

<style lang="scss" scoped>
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

@include respond-to("phone") {
    .md-customizer-config {
        border-right: none;
        border-bottom: 1px solid var(--jpz-border-color);
    }
}

:global(.md-customizer-popper) {
    z-index: 10010 !important;
}

:global(.md-customizer-color-popper .el-color-dropdown) {
    z-index: 10010 !important;
}
</style>
