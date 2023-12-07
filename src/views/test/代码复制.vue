<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-02 10:33:32
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-06 16:05:07
 * @FilePath     : \blog-client\src\views\test\Index.vue
 * @Description  : 编辑器
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<template>
  <div class="editor-out in-out-item" v-html="output" @click="handleCopyButtonClick"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import marked from '@/pkg/marked/new-marked';
import axios from 'axios';
import ClipboardJS from 'clipboard';
import type { ClipboardEvent } from 'clipboard';

const output = ref('');

onMounted(() => {
  (async () => {
    const res = await axios.get('src/assets/example/markdown.md');
    output.value = marked.parse(res.data).toString();

    // 在内容加载完成后初始化 ClipboardJS
    initializeClipboard();
  })();
});

// 初始化 ClipboardJS 的函数
const initializeClipboard = () => {
  const clipboard = new ClipboardJS('.copy-button', {
    text: (trigger: Element) => {
      // 获取对应 pre 元素的文本内容
      const preElement = trigger.nextElementSibling;

      // 添加条件检查，确保 preElement 和 preElement.textContent 不为 null
      if (preElement && preElement.textContent !== null) {
        return preElement.textContent.trim();
      } else {
        return '';
      }
    },
  });

  clipboard.on('success', (e: ClipboardEvent) => {
    // 处理成功的反馈（例如显示提示信息）
    console.log('已复制到剪贴板！');
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
  });

  clipboard.on('error', (e: ClipboardEvent) => {
    // 处理错误的反馈
    console.error('复制到剪贴板失败:', e);
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  });
};

// 使用事件委托处理复制按钮的点击事件
const handleCopyButtonClick = (event: MouseEvent) => {
  const copyButton = event.target as HTMLElement;
  const preElement = copyButton.nextElementSibling as HTMLElement;

  // 添加条件检查，确保 preElement 不为 null
  if (preElement) {
    // 触发对应 pre 元素的点击事件
    preElement.click();
  }
};
</script>


<style scoped lang="scss"></style>

