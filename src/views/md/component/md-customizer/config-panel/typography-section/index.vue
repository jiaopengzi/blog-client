<!--
 * FilePath    : blog-client\src\views\md\component\md-customizer\config-panel\typography-section\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 自定义配置面板中的排版配置区, 包含字体、字号和首行缩进开关.
-->

<template>
    <section class="md-customizer-section">
        <p class="md-customizer-section-title">排版</p>

        <div class="md-customizer-group">
            <label class="md-customizer-label">字体</label>
            <el-radio-group v-model="localState.fontFamily" class="md-customizer-radio-group" @change="emitSettingChanged">
                <el-radio-button v-for="f in fontFamilyOptions" :key="f.value || f.label" :value="f.value">
                    {{ f.label }}
                </el-radio-button>
            </el-radio-group>
        </div>

        <div class="md-customizer-group">
            <label class="md-customizer-label">字号</label>
            <el-radio-group v-model="localState.fontSize" class="md-customizer-radio-group" @change="emitSettingChanged">
                <el-radio-button v-for="s in fontSizeOptions" :key="s.value" :value="s.value">
                    {{ s.label }}
                </el-radio-button>
            </el-radio-group>
        </div>

        <div class="md-customizer-group">
            <div class="md-customizer-switch-wrap">
                <SwitchGroup :switch-items="paragraphIndentSwitchItems" @update-status="emitParagraphIndentSwitchUpdated" />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import SwitchGroup, { type SwitchItem } from "@/components/common/switch-group"
import type { MdCustomState } from "@/stores/md-custom"

import type { MdCustomizerOption } from "../../model"

defineOptions({ name: "MdCustomizerTypographySection" })

defineProps<{
    fontFamilyOptions: MdCustomizerOption[]
    fontSizeOptions: MdCustomizerOption[]
    localState: MdCustomState
    paragraphIndentSwitchItems: SwitchItem[]
}>()

const emit = defineEmits<{
    (event: "setting-changed"): void
    (event: "paragraph-indent-switch-updated", items: SwitchItem[]): void
}>()

/**
 * @description: 通知容器层重新应用当前排版配置.
 * @return 无返回值.
 */
function emitSettingChanged(): void {
    emit("setting-changed")
}

/**
 * @description: 通知容器层同步段落首行缩进开关状态.
 * @param items switch-group 返回的开关项数组.
 * @return 无返回值.
 */
function emitParagraphIndentSwitchUpdated(items: SwitchItem[]): void {
    emit("paragraph-indent-switch-updated", items)
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
</style>
