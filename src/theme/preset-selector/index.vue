<!--
 * FilePath    : blog-client-dev\src\theme\preset-selector\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 主题预设选择组件
-->

<template>
    <el-dropdown trigger="click" placement="bottom-end" popper-class="theme-preset-selector-popper" :hide-on-click="false">
        <button type="button" class="theme-trigger" :aria-label="`切换主题, 当前为 ${activePreset?.label || 'Light'}`">
            <span class="theme-trigger__swatches">
                <span class="swatch swatch--primary" :style="{ backgroundColor: activePreset?.palette.primary }"></span>
                <span class="swatch swatch--secondary" :style="{ backgroundColor: activePreset?.palette.secondary }"></span>
            </span>
            <span class="theme-trigger__label">{{ activePreset?.label || "Light" }}</span>
            <j-icon :name="activePreset?.scheme === 'dark' ? IconKeys.ThemeDark : IconKeys.ThemeLight" custom-class="theme-trigger__icon" />
        </button>

        <template #dropdown>
            <div class="theme-panel">
                <div class="theme-panel__header">主题选择</div>
                <div class="theme-panel__list">
                    <button
                        v-for="preset in presets"
                        :key="preset.id"
                        type="button"
                        class="theme-option"
                        :class="{ 'is-active': preset.id === modelValue }"
                        @click="handleSelect(preset.id)"
                    >
                        <span class="theme-option__preview">
                            <span class="swatch swatch--primary" :style="{ backgroundColor: preset.palette.primary }"></span>
                            <span class="swatch swatch--secondary" :style="{ backgroundColor: preset.palette.secondary }"></span>
                        </span>
                        <span class="theme-option__meta">
                            <span class="theme-option__label">{{ preset.label }}</span>
                            <span class="theme-option__desc">{{ preset.description }}</span>
                        </span>
                        <span v-if="preset.id === modelValue" class="theme-option__status">当前</span>
                    </button>
                </div>
            </div>
        </template>
    </el-dropdown>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import { IconKeys } from "@/components/common/icons"
import type { ThemePreset, ThemePresetId } from "@/theme/presets"

defineOptions({ name: "ThemePresetSelector" })

const { modelValue, presets } = defineProps<{
    modelValue: ThemePresetId
    presets: ThemePreset[]
}>()

const emit = defineEmits<{
    (event: "update:modelValue", value: ThemePresetId): void
}>()

const activePreset = computed(() => presets.find((preset) => preset.id === modelValue))

const handleSelect = (presetId: ThemePresetId) => {
    emit("update:modelValue", presetId)
}
</script>

<style lang="scss" scoped>
.theme-trigger {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 112px;
    padding: 6px 10px;
    border: 1px solid var(--jpz-border-color);
    border-radius: 999px;
    background: color-mix(in srgb, var(--jpz-bg-color) 88%, var(--jpz-color-primary) 12%);
    color: var(--jpz-text-color-primary);
    cursor: pointer;
    transition:
        border-color 0.2s ease,
        background-color 0.2s ease,
        transform 0.2s ease;

    &:hover {
        border-color: var(--jpz-color-primary);
        background: color-mix(in srgb, var(--jpz-bg-color) 72%, var(--jpz-color-primary) 28%);
        transform: translateY(-1px);
    }
}

.theme-trigger__swatches,
.theme-option__preview {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.swatch {
    width: 12px;
    height: 12px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.06);
}

.swatch--secondary {
    transform: translateX(-4px);
}

.theme-trigger__label {
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 600;
}

.theme-trigger__icon {
    font-size: 15px;
    fill: var(--jpz-color-primary);
}

:global(.theme-preset-selector-popper) {
    padding: 0 !important;
    border: 1px solid var(--jpz-border-color) !important;
    border-radius: 16px !important;
    background: color-mix(in srgb, var(--jpz-bg-color) 94%, #000 6%) !important;
    box-shadow: 0 18px 48px rgba(15, 23, 42, 0.16) !important;
}

.theme-panel {
    width: min(320px, calc(100vw - 24px));
    padding: 12px;
}

.theme-panel__header {
    padding: 4px 6px 10px;
    color: var(--jpz-text-color-secondary);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.theme-panel__list {
    display: grid;
    gap: 8px;
}

.theme-option {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid transparent;
    border-radius: 14px;
    background: color-mix(in srgb, var(--jpz-bg-color-page) 84%, transparent);
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition:
        border-color 0.2s ease,
        background-color 0.2s ease,
        transform 0.2s ease;

    &:hover {
        border-color: color-mix(in srgb, var(--jpz-color-primary) 48%, var(--jpz-border-color));
        background: color-mix(in srgb, var(--jpz-bg-color-page) 70%, var(--jpz-color-primary) 30%);
        transform: translateY(-1px);
    }

    &.is-active {
        border-color: var(--jpz-color-primary);
        background: color-mix(in srgb, var(--jpz-bg-color-page) 55%, var(--jpz-color-primary) 45%);
    }
}

.theme-option__meta {
    display: grid;
    gap: 3px;
}

.theme-option__label {
    color: var(--jpz-text-color-primary);
    font-size: 13px;
    font-weight: 700;
}

.theme-option__desc {
    color: var(--jpz-text-color-secondary);
    font-size: 12px;
}

.theme-option__status {
    color: var(--jpz-color-primary);
    font-size: 12px;
    font-weight: 700;
}

@include respond-to("phone") {
    .theme-trigger {
        width: 100%;
        justify-content: space-between;
    }

    .theme-trigger__label {
        max-width: none;
        flex: 1;
        text-align: left;
    }

    .theme-panel {
        width: min(340px, calc(100vw - 16px));
    }
}
</style>
