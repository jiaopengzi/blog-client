<!--
 * FilePath    : blog-client-nuxt\src\components\views\md\component\md-customizer\config-panel\image-section\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 自定义配置面板中的图片配置区, 提供图注格式切换与本地图片存储管理
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

        <div class="md-customizer-group">
            <label class="md-customizer-label">本地图片存储 (仅本浏览器)</label>
            <p class="local-image-usage">
                已存 {{ localImageUsage.count }} 张 · {{ formatLocalImageBytes(localImageUsage.totalBytes) }}
                <span class="local-image-usage__limit">(上限 {{ MAX_LOCAL_IMAGE_COUNT }} 张 · {{ formatLocalImageBytes(MAX_LOCAL_IMAGE_TOTAL_BYTES) }})</span>
            </p>
            <div class="local-image-actions">
                <el-button size="small" @click="emitPurgeLocalImages">清理未引用图片</el-button>
                <el-button size="small" type="danger" plain @click="emitClearLocalImages">清空全部图片</el-button>
            </div>
            <p class="local-image-hint">
                粘贴的截图保存在本浏览器 IndexedDB 中, 不上传服务器; 清理未引用会删除当前文档已移除的图片, 清空全部会同时移除文档中的引用。
            </p>
        </div>
    </section>
</template>

<script lang="ts" setup>
import type { MdCustomState } from "@/stores/md-custom"
import { formatLocalImageBytes, MAX_LOCAL_IMAGE_COUNT, MAX_LOCAL_IMAGE_TOTAL_BYTES, type LocalImageUsage } from "@/utils/mdLocalImage"

import { imageCaptionFormatOptions } from "../../model"

defineOptions({ name: "MdCustomizerImageSection" })

withDefaults(
    defineProps<{
        localState: MdCustomState
        /** 本地图片库用量统计 (由页面层维护并下发) */
        localImageUsage?: LocalImageUsage
    }>(),
    {
        localImageUsage: () => ({ count: 0, totalBytes: 0 }),
    },
)

const emit = defineEmits<{
    (event: "setting-changed"): void
    (event: "purge-local-images"): void
    (event: "clear-local-images"): void
}>()

/**
 * @description: 通知容器层重新应用当前图片配置.
 * @return 无返回值.
 */
function emitSettingChanged(): void {
    emit("setting-changed")
}

/**
 * @description: 通知页面层清理当前文档未引用的本地图片.
 * @return 无返回值.
 */
function emitPurgeLocalImages(): void {
    emit("purge-local-images")
}

/**
 * @description: 通知页面层清空全部本地图片并移除文档引用.
 * @return 无返回值.
 */
function emitClearLocalImages(): void {
    emit("clear-local-images")
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

// 用量行: 数值用等宽数字, 上限弱化为次要色
.local-image-usage {
    margin: 0 0 10px;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    color: var(--jpz-text-color-regular);

    &__limit {
        color: var(--jpz-text-color-secondary);
    }
}

.local-image-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

// 操作说明: 小字弱化, 帮助用户理解清理动作的影响范围
.local-image-hint {
    margin: 10px 0 0;
    font-size: 12px;
    line-height: 1.6;
    color: var(--jpz-text-color-secondary);
}
</style>
