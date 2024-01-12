<!--
 * @Author       : jiaopengzi
 * @Date         : 2024-01-11 12:36:47
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 12:36:50
 * @FilePath     : \blog-client\src\views\test\Index copy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved. 
-->
<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-01-11 12:23:57
 * @FilePath     : \blog-client\src\views\test\Index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
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

// store
const editorStore = useEditorStore()
onBeforeMount(async () => {
  await editorStore.getEditorDocFromApi("src/assets/example/markdown.md")
})

</script>
