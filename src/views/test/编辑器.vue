<!-- App.vue -->
<template>
  <EditorPost />
  <!-- <EditorComment /> -->
</template>

<script lang="ts" setup>
import { EditorPost } from '@/components/editor/core'
import { onBeforeMount } from 'vue';
import { useEditorStore } from '@/stores/editor'
defineOptions({ name: 'EditorAll' })
// store
const editorStore = useEditorStore()
onBeforeMount(async () => {
  await editorStore.getEditorContentFromUrl("src/assets/example/markdown.md")
})

</script>
