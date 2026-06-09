<!--
 * FilePath    : blog-client\src\components\common\post-upsert\thumbnail-tools.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章缩略图工具条, 负责自动插入配置和文章内图片选择入口
-->

<template>
    <div class="thumbnail-tools">
        <div class="thumbnail-insert-config">
            <div class="thumbnail-insert-config__group">
                <span class="thumbnail-insert-config__label">保存时自动插入</span>
                <el-switch v-model="autoInsertModel" inline-prompt active-text="开启" inactive-text="关闭" class="thumbnail-insert-config__switch" />
            </div>
            <span class="thumbnail-insert-config__divider" aria-hidden="true"></span>
            <div class="thumbnail-insert-config__group">
                <span class="thumbnail-insert-config__label">默认取第</span>
                <el-input-number v-model="insertIndexModel" size="small" :min="1" controls-position="right" class="thumbnail-insert-config__input" />
                <span class="thumbnail-insert-config__label">张图</span>
            </div>
        </div>

        <el-button v-if="hasEditorThumbnailOptions" type="primary" @click="emit('pick-from-article')">从文章中选择</el-button>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"

defineOptions({ name: "PostUpsertThumbnailTools" })

const { autoInsert, insertIndex, hasEditorThumbnailOptions } = defineProps<{
    autoInsert: boolean
    insertIndex: number
    hasEditorThumbnailOptions: boolean
}>()

const emit = defineEmits<{
    (event: "update:autoInsert", value: boolean): void
    (event: "update:insertIndex", value: number): void
    (event: "pick-from-article"): void
}>()

/**
 * 透传自动插入开关的双向绑定.
 * @returns 当前自动插入状态.
 */
const autoInsertModel = computed({
    get: () => autoInsert,
    set: (value: boolean) => emit("update:autoInsert", value),
})

/**
 * 透传默认插入序号的双向绑定.
 * @returns 当前默认插入序号.
 */
const insertIndexModel = computed({
    get: () => insertIndex,
    set: (value: number) => emit("update:insertIndex", value),
})
</script>

<style scoped lang="scss">
.thumbnail-tools {
    display: flex;
    align-items: center;
    align-self: flex-start;
    gap: 12px;
    flex: 0 0 auto;
    white-space: nowrap;
}

.thumbnail-insert-config {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 32px;
    white-space: nowrap;
}

.thumbnail-insert-config__group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.thumbnail-insert-config__label {
    color: var(--jpz-text-color-regular);
    font-size: 13px;
    white-space: nowrap;
}

.thumbnail-insert-config__divider {
    width: 1px;
    height: 18px;
    background: var(--jpz-border-color);
}

.thumbnail-insert-config__input {
    width: 92px;
}

.thumbnail-insert-config__switch {
    --el-switch-on-color: var(--jpz-color-primary);
    --el-switch-off-color: color-mix(in srgb, var(--jpz-text-color-secondary) 55%, #cbd5e1);
}

:deep(.thumbnail-insert-config__switch .el-switch__label) {
    font-size: 12px;
}

:deep(.thumbnail-insert-config__input .el-input__wrapper) {
    border-radius: 0;
    box-shadow: none;
}

:deep(.thumbnail-insert-config__input .el-input-number__decrease),
:deep(.thumbnail-insert-config__input .el-input-number__increase) {
    border-radius: 0;
}

:deep(.thumbnail-insert-config__input.el-input-number) {
    border-radius: 0;
}
</style>
