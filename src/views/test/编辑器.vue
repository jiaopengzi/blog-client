<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-18 09:51:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-23 12:03:54
 * @FilePath     : \blog-client\src\views\test\编辑器.vue
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
import { onBeforeMount,ref } from "vue"

import { EditorComment,EditorPost, EditorStateManager } from "@/components/editor"

defineOptions({ name: "EditorAll" })

const stateManager = new EditorStateManager()

const myHtml = ref(`
<h1>这是一个标题</h1>
<video-player id="2-7f9d0d9c" class="test22" test11="test11"></video-player>
<p>这是一个段落</p>
`)

stateManager.updateState(myHtml.value)

onBeforeMount(async () => {
    // await stateManager.getEditorContentFromUrl("src/assets/example/markdown.md")
})
</script>
<style scoped lang="scss"></style>
