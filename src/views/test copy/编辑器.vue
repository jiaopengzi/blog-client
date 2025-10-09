<template>
    <JEditor :state-manager="stateManager" />
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue"

import JEditor, { EditorStateManager } from "@/components/editor"
import { useEditor } from "@/components/hooks/useEditor"
defineOptions({ name: "EditorAll" })

const stateManager = new EditorStateManager({
    mode: "comment",
})
useEditor(stateManager)

const myHtml = ref(`
<h1>这是一个标题</h1>
<p>这是一个段落</p>
`)

stateManager.updateState(myHtml.value)

onBeforeMount(async () => {
    // await stateManager.getEditorContentFromUrl("src/assets/example/katex.md")
})
</script>
<style scoped lang="scss"></style>
