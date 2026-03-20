<!--
 * FilePath    : blog-client-dev\src\theme\preset-selector\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 主题预设选择组件
-->

<template>
    <button
        type="button"
        class="theme-trigger theme-trigger--icon-only"
        :aria-label="`切换主题, 当前为 ${activePreset?.label || 'Light'}`"
        @click="dialogVisible = true"
    >
        <j-icon :name="activePreset?.scheme === 'dark' ? IconKeys.ThemeDark : IconKeys.ThemeLight" custom-class="theme-trigger__icon" />
    </button>

    <el-dialog
        v-model="dialogVisible"
        class="theme-selector-dialog"
        align-center
        append-to-body
        destroy-on-close
        width="min(360px, calc(100vw - 24px))"
        header-class="theme-selector-dialog__header"
        body-class="theme-selector-dialog__body"
        :modal-class="isPhone ? 'theme-selector-dialog-mask theme-selector-dialog-mask--phone' : 'theme-selector-dialog-mask'"
        :show-close="false"
        :z-index="2200"
    >
        <template #header>
            <div class="theme-panel__header theme-panel__header--dialog">主题选择</div>
        </template>

        <div class="theme-panel theme-panel--dialog">
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
    </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"

import { IconKeys } from "@/components/common/icons"
import type { ThemePreset, ThemePresetId } from "@/theme/presets"
import { DeviceType, useDeviceStore } from "@/stores/device"

defineOptions({ name: "ThemePresetSelector" })

const { modelValue, presets } = defineProps<{
    modelValue: ThemePresetId
    presets: ThemePreset[]
}>()

const emit = defineEmits<{
    (event: "update:modelValue", value: ThemePresetId): void
}>()

const deviceStore = useDeviceStore()
const dialogVisible = ref(false)

const activePreset = computed(() => presets.find((preset) => preset.id === modelValue))

const isPhone = computed(() => deviceStore.device === DeviceType.PHONE)

const handleSelect = (presetId: ThemePresetId) => {
    dialogVisible.value = false
    emit("update:modelValue", presetId)
}
</script>

<style lang="scss" scoped>
.theme-trigger {
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
        border-color 0.2s ease,
        background-color 0.2s ease,
        transform 0.2s ease;

    &:hover {
        border-color: var(--jpz-color-primary);
        background: color-mix(in srgb, var(--jpz-bg-color) 72%, var(--jpz-color-primary) 28%);
        transform: translateY(-1px);
    }
}

.theme-trigger--icon-only {
    min-width: 38px;
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

.theme-trigger__icon {
    font-size: 16px;
    fill: var(--jpz-color-primary);
}

.theme-panel {
    width: min(320px, calc(100vw - 24px));
    padding: 12px;
}

.theme-panel--dialog {
    width: 100%;
    padding: 0;
}

.theme-panel__header {
    padding: 4px 6px 10px;
    color: var(--jpz-text-color-secondary);
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.theme-panel__header--dialog {
    padding: 0;
}

.theme-panel__list {
    display: grid;
    gap: 8px;
    padding-top: 10px;
    padding-bottom: 12px;
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

:global(.theme-selector-dialog) {
    padding: 0;

    .el-dialog {
        border: 1px solid var(--jpz-border-color);
        border-radius: 18px;
        background: color-mix(in srgb, var(--jpz-bg-color) 96%, #000 4%);
        box-shadow: 0 20px 48px rgba(15, 23, 42, 0.22);
    }
}

:global(.theme-selector-dialog__header) {
    margin-right: 0;
    padding: 28px 18px 14px 16px;
}

:global(.theme-selector-dialog__body) {
    padding: 0 18px 20px 16px;
}

:global(.theme-selector-dialog-mask) {
    background-color: rgba(15, 23, 42, 0.42);
}

:global(.theme-selector-dialog-mask--phone) {
    backdrop-filter: blur(4px);
}

@include respond-to("phone") {
    .theme-trigger {
        width: 36px;
        height: 36px;
    }

    .theme-panel {
        width: 100%;
    }

    .theme-panel--dialog {
        padding: 0;
    }

    .theme-panel__list {
        padding-top: 2px;
        padding-bottom: 2px;
    }

    .theme-panel__header {
        font-size: 13px;
        letter-spacing: 0.04em;
    }

    .theme-option {
        padding: 9px 12px;
        gap: 8px;
        border-radius: 12px;
    }

    .theme-option__label {
        font-size: 13px;
    }

    .theme-option__desc {
        font-size: 11px;
        line-height: 1.3;
    }

    .theme-option__status {
        font-size: 11px;
        white-space: nowrap;
    }

    :global(.theme-selector-dialog .el-dialog) {
        width: calc(100vw - 40px) !important;
        border-radius: 18px;
    }

    :global(.theme-selector-dialog__header) {
        padding: 18px 14px 8px;
    }

    :global(.theme-selector-dialog__body) {
        padding: 0 14px 12px;
    }
}
</style>
