<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-18 09:51:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-19 15:45:30
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
    <EditorPost :editor-state="editorState" />
    <!-- <EditorComment  :editor-state="editorState"/> -->
</template>

<script lang="ts" setup>
import {
    EditorStateManager,
    EditorPost,
    EditorComment,
    createEmptyEditorState,
} from "@/components/editor"
import type { EditorState } from "@/components/editor"

import { onBeforeMount } from "vue"

defineOptions({ name: "EditorAll" })
// store
const editorState: EditorState = createEmptyEditorState()
const stateManager = new EditorStateManager(editorState)
onBeforeMount(async () => {
    await stateManager.getEditorContentFromUrl("src/assets/example/markdown.md")
    console.log("editorState", editorState)
})
</script>
