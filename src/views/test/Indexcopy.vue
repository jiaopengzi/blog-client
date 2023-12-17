<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-12 12:36:22
 * @FilePath     : \blog-client\src\views\test\Indexcopy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
  <div class="other" v-show="!editorIsFullScreen">其他内容</div>
  <Editor />
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import Editor from '@/components/common/editor/Editor.vue';

const editorStore = useEditorStore()
const { isFullScreen: editorIsFullScreen } = storeToRefs(editorStore)

</script>
