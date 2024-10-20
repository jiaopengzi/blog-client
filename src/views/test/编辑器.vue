<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-18 09:51:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-20 17:01:34
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
import { EditorStateManager, EditorPost, EditorComment } from "@/components/editor"

import { onBeforeMount } from "vue"

defineOptions({ name: "EditorAll" })

const stateManager = new EditorStateManager()

onBeforeMount(async () => {
    // await stateManager.getEditorContentFromUrl("src/assets/example/markdown.md")
})
</script>
<style scoped lang="scss"></style>
