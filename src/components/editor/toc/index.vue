<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-12 13:02:01
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-20 18:34:59
 * @FilePath     : \blog-client\src\components\editor\toc\index.vue
 * @Description  : 目录组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <nav id="toc">
        <ul>
            <!-- 根据 heading.level 动态设置 li 的 id 和 class -->
            <li
                v-for="(heading, index) in props.headings"
                :id="'toc-' + heading.index"
                :key="heading.index"
                :class="'h-level-' + heading.level"
                @click="emitHeadingClicked(index)"
            >
                {{ heading.text }}
            </li>
        </ul>
    </nav>
</template>

<script lang="ts" setup>
import type { TocProps } from "@/components/editor/toc"
import { watchEffect } from "vue"

defineOptions({ name: "EditorToc" })
// 定义 props 调用时候传递为 headings="headings"
const props = defineProps<TocProps>()

// 子组件 传参
const emit = defineEmits<{
    (e: "heading-clicked", index: number): void
}>()

// 点击标题触发事件
const emitHeadingClicked = (index: number) => {
    console.log("emitHeadingClicked", index)
    // 触发自定义事件 "heading-clicked"，将 index 和 heading 传递给父组件
    emit("heading-clicked", index)

    highlightHeading(index)
}

// 高亮标题
const highlightHeading = (index: number) => {
    // 查找当前激活的目录项，移除激活状态
    document.querySelectorAll("#toc li").forEach((li) => {
        li.classList.remove("toc-active")
    })

    // 添加激活状态
    document.getElementById("toc-" + index)?.classList.add("toc-active")
}

watchEffect(() => {
    if (props.headingShowCurrentIndex >= 0) {
        highlightHeading(props.headingShowCurrentIndex)
    }
})
</script>

<style scoped lang="scss">
#toc {
    // 添加不同缩进和样式
    li {
        line-height: 1.5;
        font-weight: 500;
        list-style: none; // 去除默认的列表样式
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
        margin-left: 1em;
    }

    .h-level-3 {
        margin-left: 2em;
    }

    .h-level-4 {
        margin-left: 3em;
    }

    .level-5 {
        margin-left: 4em;
    }

    .h-level-6 {
        margin-left: 5em;
    }
}
</style>
