<!--
 * FilePath    : blog-client\src\views\md\component\md-customizer\config-panel\visual-section\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 自定义配置面板中的视觉配置区, 包含主题色、代码块主题和行号开关.
-->

<template>
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
                    :class="{ 'is-active': themeColorMode === preset.key, 'is-neutral': !getPresetDisplayColor(preset.key) }"
                    :aria-pressed="themeColorMode === preset.key"
                    @click="emitThemeColorModeChanged(preset.key)"
                >
                    <span class="md-customizer-theme-option__dot" :style="getPresetDotStyle(preset.key)"></span>
                    <span>{{ preset.label }}</span>
                </button>
            </div>
            <div v-if="themeColorMode === 'custom'" class="md-customizer-color-row">
                <el-color-picker
                    :model-value="customThemeColor"
                    popper-class="md-customizer-popper md-customizer-color-popper"
                    @update:model-value="emitCustomThemeColorChanged"
                />
                <span class="md-customizer-color-value">{{ customThemeColor }}</span>
            </div>
        </div>

        <div class="md-customizer-group">
            <label class="md-customizer-label">代码块主题</label>
            <el-select v-model="localState.codeBlockTheme" placeholder="选择主题" filterable popper-class="md-customizer-popper" @change="emitSettingChanged">
                <el-option v-for="t in availableThemes" :key="t" :label="t" :value="t" />
            </el-select>
        </div>

        <div class="md-customizer-group">
            <div class="md-customizer-switch-wrap">
                <SwitchGroup :switch-items="lineNumberSwitchItems" @update-status="emitLineNumberSwitchUpdated" />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import SwitchGroup, { type SwitchItem } from "@/components/common/switch-group"
import type { MdCustomState } from "@/stores/md-custom"

import { getThemePresetDisplayColor, getThemePresetDotStyle, type ThemeColorMode, type ThemeColorPresetOption } from "../../model"

defineOptions({ name: "MdCustomizerVisualSection" })

const props = defineProps<{
    availableThemes: string[]
    customThemeColor: string
    lineNumberSwitchItems: SwitchItem[]
    localState: MdCustomState
    themeColorMode: ThemeColorMode
    themeColorPresetOptions: ReadonlyArray<ThemeColorPresetOption>
}>()

const emit = defineEmits<{
    (event: "setting-changed"): void
    (event: "theme-color-mode-changed", mode: ThemeColorMode): void
    (event: "custom-theme-color-changed", value: string | null): void
    (event: "line-number-switch-updated", items: SwitchItem[]): void
}>()

/**
 * @description: 获取主题色预设当前应展示的颜色值.
 * @param key 主题色预设键.
 * @return 该预设应显示的颜色值, 无颜色时返回空字符串.
 */
function getPresetDisplayColor(key: ThemeColorMode): string {
    return getThemePresetDisplayColor(key, props.customThemeColor)
}

/**
 * @description: 生成主题色预设色点样式, 保持按钮内的颜色识别度.
 * @param key 主题色预设键.
 * @return 色点的行内样式对象.
 */
function getPresetDotStyle(key: ThemeColorMode): Record<string, string> {
    return getThemePresetDotStyle(key, props.customThemeColor)
}

/**
 * @description: 通知容器层重新应用当前视觉配置.
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
</script>

<style lang="scss" scoped>
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

@include respond-to("phone") {
    .md-customizer-theme-grid {
        grid-template-columns: 1fr;
    }
}
</style>
