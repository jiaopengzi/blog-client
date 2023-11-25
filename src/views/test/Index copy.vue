<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-25 12:01:00
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-25 12:01:03
 * @FilePath     : \blog-client\src\views\test\Index copy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-03 21:22:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-21 16:45:28
 * @FilePath     : \blog-client\src\views\Test.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="test">
    hasdf
  </div>

  <div class="editor">
    <textarea class="input" :value="input" @input="update"></textarea>
    <div class="output" v-html="output"></div>
  </div>
</template>

<script lang="ts" setup>
import '@/assets/drake-vue.css'
import { ref, computed } from 'vue'
import marked from '@/utils/marked/custom-marked'; // 引入重新封装的 marked

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
