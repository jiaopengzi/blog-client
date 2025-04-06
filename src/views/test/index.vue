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

onBeforeMount(async () => {
    await stateManager.getEditorContentFromUrl("src/assets/example/katex.md")
})
</script>
<style scoped lang="scss"></style>
