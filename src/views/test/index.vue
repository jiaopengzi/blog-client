<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-09-18 09:51:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-24 15:58:34
 * @FilePath     : \blog-client\src\views\test\index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
  <!-- <EditorPost /> -->
  <EditorComment />
</template>

<script lang="ts" setup>
import { EditorPost } from '@/components/editor/core'
import { EditorComment } from '@/components/editor/core'
import { onBeforeMount } from 'vue';
import { useEditorStore } from '@/stores/editor'
defineOptions({ name: 'EditorAll' })
// store
const editorStore = useEditorStore()
onBeforeMount(async () => {
  await editorStore.getEditorContentFromUrl("src/assets/example/markdown.md")
})

</script>
