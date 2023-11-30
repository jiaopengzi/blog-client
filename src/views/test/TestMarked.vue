<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-07 01:57:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-29 15:49:41
 * @FilePath     : \blog-client\src\views\test\TestMarked.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="editor">
    <textarea class="input" :value="input" @input="update"></textarea>
    <div class="output" v-html="output"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import marked from '@/utils/marked/new-marked'; // 引入重新封装的 marked

const input = ref('# hello \n==world==\n\n==阿斯蒂芬==');
const output = computed(() => marked.parse(input.value));

const update = (e: Event) => {
  input.value = (e.target as HTMLInputElement).value;
}
</script>

<style>
.editor {
  height: 100vh;
  display: flex;
}
</style>
