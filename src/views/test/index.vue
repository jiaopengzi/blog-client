<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-07-19 15:35:07
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
  <EditorPost />
  <!-- <EditorComment /> -->
</template>

<script lang="ts" setup>
import { EditorPost } from '@/components/editor/core'
import { onBeforeMount } from 'vue';
import { useEditorStore } from '@/stores/editor'
defineOptions({ name: 'EditorPostTest' })
// store
const editorStore = useEditorStore()
onBeforeMount(async () => {
  await editorStore.getEditorContentFromUrl("src/assets/example/markdown.md")
})

</script>
