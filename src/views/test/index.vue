<template>
    <EditorPost :editor-state="stateManager.getState()" />
    <!-- <EditorComment :editor-state="stateManager.getState()" /> -->
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue"

import { EditorComment, EditorPost, EditorStateManager } from "@/components/editor"
defineOptions({ name: "EditorAll" })

const stateManager = new EditorStateManager()

const myHtml = ref(`
<h1>这是一个标题</h1>
<p>这是一个段落</p>
`)

stateManager.updateState(myHtml.value)

onBeforeMount(async () => {
    await stateManager.getEditorContentFromUrl("src/assets/example/katex.md")
})
</script>
<style scoped lang="scss"></style>
