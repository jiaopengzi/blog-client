<!--
 * FilePath    : blog-client\src\views\md\component\md-customizer\config-panel\image-section\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 自定义配置面板中的图片配置区, 当前提供图注格式切换.
-->

<template>
    <section class="md-customizer-section">
        <p class="md-customizer-section-title">图片</p>

        <div class="md-customizer-group">
            <label class="md-customizer-label">图注格式</label>
            <el-radio-group v-model="localState.imageCaptionFormat" class="md-customizer-radio-group" @change="emitSettingChanged">
                <el-radio-button v-for="option in imageCaptionFormatOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </el-radio-button>
            </el-radio-group>
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { MdCustomState } from "@/stores/md-custom"

import { imageCaptionFormatOptions } from "../../model"

defineOptions({ name: "MdCustomizerImageSection" })

defineProps<{
    localState: MdCustomState
}>()

const emit = defineEmits<{
    (event: "setting-changed"): void
}>()

/**
 * @description: 通知容器层重新应用当前图片配置.
 * @return 无返回值.
 */
function emitSettingChanged(): void {
    emit("setting-changed")
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
</style>
