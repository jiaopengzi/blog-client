<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-10-16 17:07:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-16 17:07:04
 * @FilePath     : \blog-client\src\views\test\MarkdownViewer.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- src/components/MarkdownViewer.vue -->
<template>
    <div ref="markdownContainer" v-html="parsedContent"></div>
</template>

<script lang="ts" setup>
import { onMounted,ref } from "vue"

import { mountVueComponents,parseMarkdown } from "./markdownParser"

const props = defineProps<{ content: string }>()
const parsedContent = ref(parseMarkdown(props.content))
const markdownContainer = ref<HTMLElement | null>(null)

onMounted(() => {
    if (markdownContainer.value) {
        mountVueComponents(markdownContainer.value)
    }
})
</script>

<style scoped>
/* 样式定义 */
</style>
