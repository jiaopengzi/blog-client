<!--
 * FilePath    : blog-client\src\components\editor\components\toc\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 目录组件
-->

<template>
    <nav id="toc" ref="tocRef">
        <h2 class="toc-title">目录</h2>
        <ul class="toc-list">
            <!-- 根据 heading.level 动态设置 li 的 id 和 class -->
            <li
                v-for="(heading, index) in headings"
                :id="`toc-${index}`"
                :key="index"
                :class="`h-level-${heading.level} toc-item`"
                @click="emitHeadingClicked(index)"
            >
                {{ heading.text }}
            </li>
        </ul>
        <div class="active-marker" ref="activeMarkerRef"></div>
    </nav>
</template>

<script lang="ts" setup>
import { nextTick, useTemplateRef, watch } from "vue"

import type { TocProps } from "./types"

defineOptions({ name: "EditorToc" })

const { headings, headingShowCurrentIndex } = defineProps<TocProps>()

const emit = defineEmits<{
    (e: "heading-clicked", index: number): void
}>()

const tocRef = useTemplateRef("tocRef")
const activeMarkerRef = useTemplateRef("activeMarkerRef")

/**
 * resetHeadingHighlight 清理当前目录激活态和 marker 样式.
 * @returns 无返回值.
 */
const resetHeadingHighlight = (): void => {
    if (!tocRef.value || !activeMarkerRef.value) return

    tocRef.value.querySelectorAll("li").forEach((li) => {
        li.classList.remove("toc-active")
    })

    activeMarkerRef.value.style.top = "0px"
    activeMarkerRef.value.style.height = "0px"
}

// 点击标题触发事件
const emitHeadingClicked = (index: number) => {
    emit("heading-clicked", index)

    highlightHeading(index)
}

// 高亮标题
const highlightHeading = (index: number) => {
    // 确保 tocRef 存在
    if (!tocRef.value || !activeMarkerRef.value) return

    resetHeadingHighlight()

    // 添加激活状态
    const target: HTMLElement | null = tocRef.value.querySelector(`#toc-${index}`)
    if (target) {
        // 动态计算位置和高度
        const top = target.offsetTop
        const height = target.offsetHeight

        // 设置激活标记的位置和高度
        activeMarkerRef.value.style.top = `${top}px`
        activeMarkerRef.value.style.height = `${height}px`
        target.classList.add("toc-active")
    }
}

// 监听 headingShowCurrentIndex 的变化, 高亮对应的标题
watch(
    [() => headings, () => headingShowCurrentIndex],
    async ([newHeadings, newIndex]) => {
        if (newHeadings.length <= 0 || newIndex < 0 || newIndex >= newHeadings.length) {
            resetHeadingHighlight()
            return
        }

        await nextTick()
        highlightHeading(newIndex)
    },
    { flush: "post" }, // 确保在 DOM 更新后执行
)
</script>

<style scoped lang="scss">
#toc {
    padding: 0 1em;
    // 添加不同缩进和样式
    // border: 1px solid var(--jpz-border-color);
    background-color: var(--jpz-bg-color);
    border-radius: 5px;
    position: relative;

    .toc-title {
        font-size: 1.2em;
        font-weight: 600;
        color: var(--jpz-color-primary);
        margin-bottom: 0.5em;
        padding-top: 0.5em;
    }

    .toc-list {
        margin: 0;
        padding: 0;
        list-style: none; // 去除默认的列表样式
    }

    .toc-item {
        line-height: 2;
        // font-weight: 500;
        color: var(--jpz-color-primary);

        &.toc-active {
            color: var(--jpz-color-secondary);
        }

        &:hover {
            cursor: pointer;
            color: var(--jpz-color-secondary);
            text-decoration: underline;
        }
    }
    .h-level-1 {
        margin-left: 0;
    }

    .h-level-2 {
        margin-left: 0.5em;
    }

    .h-level-3 {
        margin-left: 1em;
    }

    .h-level-4 {
        margin-left: 1.5em;
    }

    .h-level-5 {
        margin-left: 2em;
    }

    .h-level-6 {
        margin-left: 2.5em;
    }

    .active-marker {
        position: absolute;
        top: 0;
        left: 6px;
        border-radius: 4px;
        width: 6px;
        background-color: var(--jpz-color-secondary);
        opacity: 0.9;
        transition:
            left 0.3s ease-in-out,
            top 0.3s ease-in-out;
    }
}
</style>
