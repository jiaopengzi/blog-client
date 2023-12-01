<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-29 16:56:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-01 19:24:51
 * @FilePath     : \blog-client\src\views\test\Indexcopy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->

<template>
  <!-- <div class="editor">
        <textarea class="input" :value="input" @input="update"></textarea>
        <div class="output" v-html="output"></div>
    </div> -->
  <div class="editor" contenteditable="true" @input="update"></div>
  <!-- <div class="output" v-html="output"></div> -->
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import marked from '@/pkg/marked/new-marked' // 引入重新封装的 marked
import { readFile } from '@/utils/readfile'

const input = ref('')

onMounted(async () => {
  const example = await readFile('src/assets/example/markdown.md')
  input.value = example
})

const output = computed(() => marked.parse(input.value))

const update = (e: Event) => {
  input.value = (e.target as HTMLInputElement).value
}
</script>

<style>
/* .editor {
    height: 100vh;
    display: flex;
} */
.editor {
  border: 1px solid #000;
  padding: 10px;
  min-height: 100px;
  width: 300px;
}
</style>
@/utils/readfile@/pkg/marked/new-marked
