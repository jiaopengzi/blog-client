<!--
 * FilePath    : blog-client\src\views\md\component\page-header\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页面头部组件，包含页面标题、主题预设选择和操作按钮等元素.
-->

<template>
    <header class="md-page-header">
        <div class="md-page-title-block">
            <p class="md-page-eyebrow">公共编辑空间</p>
            <h1 class="md-page-title">Markdown 编辑器</h1>
        </div>

        <div class="md-page-actions">
            <div class="md-page-controls">
                <ThemePresetSelector :model-value="activeThemePreset" :presets="themePresetOptions" @update:model-value="emitSelectThemePreset" />

                <button type="button" class="md-page-customize-btn" aria-label="自定义页面样式" title="自定义页面样式" @click="emitOpenCustomizer">
                    <span class="md-page-customize-btn__icon">
                        <j-icon :name="IconKeys.Setting" custom-class="md-page-customize-btn__icon-svg" />
                    </span>
                </button>

                <button type="button" class="md-page-home-btn" aria-label="返回首页" title="返回首页" @click="emitGoHome">
                    <span class="md-page-home-btn__icon">
                        <j-icon :name="IconKeys.Home" custom-class="md-page-home-btn__icon-svg" />
                    </span>
                </button>
            </div>

            <div class="md-page-save-status" :data-status="saveStatus.type">
                <span class="md-page-save-dot"></span>
                <span>{{ saveStatus.text }}</span>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { IconKeys } from "@/components/common/icons"
import ThemePresetSelector from "@/theme/preset-selector"
import type { ThemePreset, ThemePresetId } from "@/theme/presets"

defineOptions({ name: "MdPageHeader" })

defineProps<{
    activeThemePreset: ThemePresetId
    themePresetOptions: ThemePreset[]
    saveStatus: {
        text: string
        type: "idle" | "saved" | "error"
    }
}>()

const emit = defineEmits<{
    (event: "select-theme-preset", value: ThemePresetId): void
    (event: "open-customizer"): void
    (event: "go-home"): void
}>()

/**
 * @description: 将主题预设选择结果抛给页面容器处理.
 * @param presetId 当前选中的主题预设 ID.
 * @return 无返回值.
 */
function emitSelectThemePreset(presetId: ThemePresetId): void {
    emit("select-theme-preset", presetId)
}

/**
 * @description: 通知页面容器打开自定义弹窗.
 * @return 无返回值.
 */
function emitOpenCustomizer(): void {
    emit("open-customizer")
}

/**
 * @description: 通知页面容器执行返回首页逻辑.
 * @return 无返回值.
 */
function emitGoHome(): void {
    emit("go-home")
}
</script>

<style scoped lang="scss">
.md-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 20px 0;
}

.md-page-title-block {
    max-width: 760px;
}

.md-page-eyebrow {
    margin: 0 0 7px;
    color: var(--jpz-color-primary);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
}

.md-page-title {
    margin: 0;
    color: var(--jpz-text-color-primary);
    font-size: clamp(28px, 3.3vw, 38px);
    line-height: 1.08;
    font-family: Georgia, "Times New Roman", serif;
}

.md-page-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    min-width: 132px;
    padding-top: 2px;
}

.md-page-controls {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.md-page-save-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid color-mix(in srgb, var(--jpz-border-color) 88%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--jpz-bg-color) 92%, transparent);
    color: var(--jpz-text-color-regular);
    font-size: 12px;
}

.md-page-save-status[data-status="saved"] {
    color: var(--jpz-color-success);
}

.md-page-save-status[data-status="error"] {
    color: var(--jpz-color-danger);
}

.md-page-save-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0 5px color-mix(in srgb, currentColor 14%, transparent);
}

.md-page-home-btn,
.md-page-customize-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    padding: 0;
    border: 1px solid var(--jpz-border-color);
    border-radius: 999px;
    background: color-mix(in srgb, var(--jpz-bg-color) 88%, var(--jpz-color-primary) 12%);
    color: var(--jpz-text-color-primary);
    cursor: pointer;
    transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        background-color 0.2s ease,
        box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-1px);
        border-color: var(--jpz-color-primary);
        background: color-mix(in srgb, var(--jpz-bg-color) 72%, var(--jpz-color-primary) 28%);
        box-shadow: 0 12px 24px color-mix(in srgb, var(--jpz-box-shadow) 18%, transparent);
    }
}

.md-page-home-btn__icon,
.md-page-customize-btn__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.md-page-home-btn__icon-svg,
.md-page-customize-btn__icon-svg {
    width: 16px;
    height: 16px;
    fill: var(--jpz-color-primary);
}

@include respond-to("phone") {
    .md-page-header {
        flex-direction: column;
        gap: 12px;
        padding: 14px 14px 0;
    }

    .md-page-actions {
        align-items: stretch;
        min-width: 100%;
        padding-top: 0;
    }

    .md-page-controls {
        justify-content: space-between;
    }

    .md-page-home-btn,
    .md-page-customize-btn {
        width: 36px;
        height: 36px;
    }
}
</style>
