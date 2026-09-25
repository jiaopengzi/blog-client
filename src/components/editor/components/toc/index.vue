<!--
 * FilePath    : blog-client\src\components\editor\components\toc\index.vue
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 目录组件 (260917-01: 激活项自动滚入视野; id 定位改 data-index, 规避正文粘贴同 id 内容的重复 id; 260925-04: 激活项滚入视野改为只滚目录自身滚动容器, 不再连带页面滚动条)
-->

<template>
    <nav class="toc-nav" ref="tocRef">
        <h2 class="toc-title">目录</h2>
        <ul class="toc-list">
            <!-- 根据 heading.level 动态设置 li 的 class; 260917-01: data-index 取代 id, 正文粘贴含 #toc-N 的内容时不再产生重复 id -->
            <li
                v-for="(heading, index) in headings"
                :key="index"
                :data-index="index"
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
 * resetHeadingHighlight 清理当前目录激活态和 marker 样式
 * @returns 无返回值
 */
const resetHeadingHighlight = (): void => {
    if (!tocRef.value || !activeMarkerRef.value) return

    tocRef.value.querySelectorAll("li").forEach((li) => {
        li.classList.remove("toc-active")
    })

    activeMarkerRef.value.style.top = "0px"
    activeMarkerRef.value.style.height = "0px"
}

/**
 * scrollActiveItemIntoView 将激活目录项滚入目录自身滚动容器的视野.
 * @remarks bugfix 260925-04: 原生 scrollIntoView({block:"nearest"}) 会遍历全部可滚动的祖先链,
 * admin 写作页的 main.el-main (页面级滚动容器) 也在链上 — 激活项低于其可视区时最右侧页面滚动条被连带拖动,
 * 与用户手动滚动相互拉扯造成来回抖动 (260917-01 注释"不影响页面滚动位置"的判断有误, 实测可拉动页面);
 * 现仅调整最近的滚动容器 (编辑器侧栏 .md-toc / 浮动目录面板 .toc-floating-body), 外层滚动容器一律不动.
 * @param target - 待滚入视野的目录项元素.
 * @returns 无返回值.
 */
const scrollActiveItemIntoView = (target: HTMLElement): void => {
    let el: HTMLElement | null = target.parentElement
    while (el && el !== document.body && el !== document.documentElement) {
        // overflowY 为 auto/scroll/overlay 且存在实际溢出才视为滚动容器; 阈值 1px 排除子像素取整噪音
        if (/(auto|scroll|overlay)/.test(window.getComputedStyle(el).overflowY) && el.scrollHeight - el.clientHeight > 1) {
            const containerRect = el.getBoundingClientRect()
            const targetRect = target.getBoundingClientRect()
            if (targetRect.top < containerRect.top) {
                el.scrollTop -= containerRect.top - targetRect.top
            } else if (targetRect.bottom > containerRect.bottom) {
                el.scrollTop += targetRect.bottom - containerRect.bottom
            }
            return
        }
        el = el.parentElement
    }
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
    const target: HTMLElement | null = tocRef.value.querySelector(`[data-index="${index}"]`)
    if (target) {
        // 动态计算位置和高度
        const top = target.offsetTop
        const height = target.offsetHeight

        // 设置激活标记的位置和高度
        activeMarkerRef.value.style.top = `${top}px`
        activeMarkerRef.value.style.height = `${height}px`
        target.classList.add("toc-active")

        // 260917-01: 目录列表自身可滚动时(侧栏吸顶 max-height / 沉浸浮动面板), 激活项可能被滚出列表视野,
        // 需滚入视野; 260925-04: 改用 scrollActiveItemIntoView, 只滚目录自身滚动容器, 不连带页面滚动条
        scrollActiveItemIntoView(target)
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
    // 260917-01-feedback#2: immediate 保证晚挂载场景 (沉浸模式浮动目录等) 首帧即高亮当前标题,
    // 否则 props 已是终态不再变化, watch 永不触发, 面板无高亮无定位
    { flush: "post", immediate: true }, // 确保在 DOM 更新后执行
)
</script>

<style scoped lang="scss">
.toc-nav {
    padding: 0 1em;
    // 添加不同缩进和样式
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
