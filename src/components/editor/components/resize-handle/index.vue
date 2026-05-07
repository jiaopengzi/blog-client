<!--
 * FilePath    : blog-client\src\components\editor\components\resize-handle\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器分隔条
-->

<template>
    <button
        type="button"
        tabindex="-1"
        class="md-resize-handle"
        :class="{ 'is-dragging': isDragging }"
        :aria-label="label"
        title="双击恢复默认宽度"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
        @pointerdown="handlePointerdown"
        @dblclick="handleDoubleClick"
    ></button>
</template>

<script lang="ts" setup>
defineOptions({ name: "EditorResizeHandle" })

const { label, isDragging = false } = defineProps<{
    label: string
    isDragging?: boolean
}>()

const emit = defineEmits<{
    (event: "resize-start", e: PointerEvent): void
    (event: "restore-default"): void
}>()

/**
 * handleKeydown 屏蔽分隔条按钮的回车与空格默认激活。
 * @param event - 当前键盘按下事件。
 * @returns 无返回值。
 */
const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
    }
}

/**
 * handleKeyup 屏蔽空格抬起时的按钮默认触发。
 * @param event - 当前键盘抬起事件。
 * @returns 无返回值。
 */
const handleKeyup = (event: KeyboardEvent): void => {
    if (event.key === " ") {
        event.preventDefault()
    }
}

/**
 * handlePointerdown 将拖拽开始事件交回父组件处理。
 * @param event - 当前 pointerdown 事件。
 * @returns 无返回值。
 */
const handlePointerdown = (event: PointerEvent): void => {
    emit("resize-start", event)
}

/**
 * handleDoubleClick 处理双击恢复默认宽度。
 * @param event - 当前双击事件。
 * @returns 无返回值。
 */
const handleDoubleClick = (event: MouseEvent): void => {
    event.preventDefault()
    emit("restore-default")
}
</script>

<style scoped lang="scss">
.md-resize-handle {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background-color: transparent;
    cursor: col-resize;
    touch-action: none;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px;
        transform: translateX(-50%);
        background-color: var(--jpz-border-color);
    }

    &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4px;
        height: 42px;
        transform: translate(-50%, -50%);
        border-radius: 999px;
        background-color: var(--jpz-border-color);
        opacity: 0.35;
        transition:
            opacity 0.2s ease,
            background-color 0.2s ease;
    }

    &:hover::after,
    &.is-dragging::after {
        opacity: 0.8;
        background-color: var(--jpz-main-color);
    }
}
</style>
