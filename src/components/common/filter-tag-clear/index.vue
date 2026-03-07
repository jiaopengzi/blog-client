<!--
 * FilePath    : blog-client\src\components\common\filter-tag-clear\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 可清除的筛选标签组件
-->

<template>
    <div class="filter-tag-clear">
        <el-button class="filter-tag-clear-btn" :icon="Close" circle plain size="small" :title="title" @click="handleClear" />
        <el-input-tag class="filter-tag-clear-input" :model-value="tags" disabled />
    </div>
</template>

<script lang="ts" setup>
import { Close } from "@element-plus/icons-vue"

defineOptions({ name: "FilterTagClear" })

const { tags, title = "清除筛选" } = defineProps<{
    /** tags, 当前展示的筛选标签列表。 */
    tags: string[]
    /** title, 清除按钮的提示文案。 */
    title?: string
}>()

const emit = defineEmits<{
    /** clear, 点击清除按钮后触发。 */
    (event: "clear"): void
}>()

/** 处理清除操作, 交由父组件重置筛选状态。 */
const handleClear = () => {
    emit("clear")
}
</script>

<style scoped lang="scss">
.filter-tag-clear {
    display: flex;
    align-items: center;
    position: relative;

    .filter-tag-clear-input {
        margin-right: 10px;
    }

    .filter-tag-clear-btn {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        width: 22px;
        height: 22px;
        padding: 0;
        border-radius: 999px;
        border-color: var(--el-border-color);
        background: var(--el-bg-color-overlay);
        color: var(--el-text-color-secondary);
        box-shadow: 0 2px 8px rgb(15 23 42 / 10%);
        transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background-color 0.2s ease,
            box-shadow 0.2s ease;

        &:hover {
            border-color: var(--el-color-danger-light-5);
            background: var(--el-color-danger-light-9);
            color: var(--el-color-danger);
            box-shadow: 0 4px 12px rgb(239 68 68 / 16%);
        }
    }
}
</style>
