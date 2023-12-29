<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-28 23:10:22
 * @FilePath     : \blog-client\src\views\test\Index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
  <div class="other" v-show="!isFullScreen">其他内容</div>
  <div class="other" v-show="!isFullScreen">其他内容</div>
  <div class="other" v-show="!isFullScreen">其他内容</div>


  <EditorPost />
  <!-- <EditorComment /> -->
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { EditorPost } from '@/components/common/editor/core'
import { EditorComment } from '@/components/common/editor/core'


const test = ref(1)
test.value = 2
const editorStore = useEditorStore()
const { isFullScreen } = storeToRefs(editorStore)

</script>
