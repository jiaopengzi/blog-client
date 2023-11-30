<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-11-30 10:24:09
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-30 10:24:12
 * @FilePath     : \blog-client\src\views\test\Index copy 3.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
    <div>
        <div ref="editor" class="editor" contenteditable="true" @input="formatHeaders"></div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const editor = ref<HTMLDivElement | null>(null);

function formatHeaders() {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const startTextNode = range.startContainer;
    const currentLineText = startTextNode.textContent;

    // Check if the line starts with a '#'
    if (currentLineText?.startsWith('#')) {
        startTextNode.parentElement!.style.fontWeight = 'bold';
    } else {
        startTextNode.parentElement!.style.fontWeight = 'normal';
    }
}

onMounted(() => {
    editor.value?.focus();
});
</script>
  
<style scoped>
.editor {
    border: 1px solid #ccc;
    padding: 10px;
    width: 400px;
    height: 300px;
}
</style>
  