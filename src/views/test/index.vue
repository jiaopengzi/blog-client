<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-18 09:51:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-23 19:42:23
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
    <EditorPost :editor-state="stateManager.getState()" />
    <!-- <EditorComment :editor-state="stateManager.getState()" /> -->
</template>

<script lang="ts" setup>
import { EditorStateManager, EditorPost, EditorComment } from "@/components/editor"
// import EditorPost from "@/components/editor/core/EditorPost.vue"
// import EditorComment from "@/components/editor/core/EditorComment.vue"

import { ref, h, onMounted, createApp, nextTick, onBeforeMount } from "vue"

defineOptions({ name: "EditorAll" })

const stateManager = new EditorStateManager()

// const myHtml = ref(`
// <h1>这是一个标题</h1>
// <video-player id="m-14-8e72860c"></video-player>
// <video-player id="m-16-8de13d3c"></video-player>
// <p>这是一个段落</p>
// `)

// stateManager.updateState(myHtml.value)

onBeforeMount(async () => {
    await stateManager.getEditorContentFromUrl("src/assets/example/markdown.md")
})
</script>
<style scoped lang="scss"></style>
