<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-12 13:02:01
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-27 16:19:05
 * @FilePath     : \blog-client\src\components\common\editor\toc\index.vue
 * @Description  : 目录组件
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
    <nav id="toc">
        <ul>
            <!-- 使用 v-for 的 index 作为 key 和唯一标识符 -->
            <!-- 根据 heading.level 动态设置 li 的 class -->
            <li
                v-for="(heading, index) in props.headings"
                :key="index"
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

// eslint-disable-next-line vue/multi-word-component-names
defineOptions({ name: "Toc" })
// 定义 props 调用时候传递为 headings="headings"
const props = defineProps<TocProps>()

// 子组件 传参
const emit = defineEmits<{
    (e: "heading-clicked", index: number): void
}>()

function emitHeadingClicked(index: number) {
    // 触发自定义事件 "heading-clicked"，将 index 和 heading 传递给父组件
    emit("heading-clicked", index)
}
</script>

<style scoped lang="scss">
#toc {
    // 添加不同缩进和样式
    li {
        line-height: 1.5;
        font-size: 1.2em;
        list-style: none; // 去除默认的列表样式
        color: $primary-color;

        &:hover {
            cursor: pointer;
            color: $secondary-color;
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
