<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-06 13:59:37
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-07 11:45:07
 * @FilePath     : \blog-client\src\views\test\Index copy.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!--
 * @FilePath     : \blog-client\src\views\test\Index.vue
-->
<template>
  <div class="editor-out in-out-item" v-html="output"></div>
  <!-- 参考:https://github.com/element-plus/element-plus/blob/dev/packages/components/image/src/image.vue -->
  <el-image-viewer v-if="isShow" @close="closeImgViewer" :url-list="urlList" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import marked from '@/pkg/marked/new-marked';
import axios from 'axios';
import { extractImageUrlsFromHtml, shiftArray } from '@/utils/img';

const output = ref('');
const urlList = ref<string[]>([]);
const url = ref<string>('');
const isShow = ref<boolean>(false);

const handleClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement; // Explicitly cast to HTMLElement

  // Check if the target is an HTMLImageElement
  if (target.tagName.toLowerCase() === 'img' && 'src' in target) {
    const imgElement = target as HTMLImageElement; // Cast to HTMLImageElement
    url.value = imgElement.src;
    urlList.value = shiftArray(urlList.value, imgElement.src);
    isShow.value = true;
  }
};


const closeImgViewer = () => {
  isShow.value = false;
};
onMounted(async () => {
  const res = await axios.get('src/assets/example/markdown.md');
  output.value = marked.parse(res.data).toString()
  urlList.value = extractImageUrlsFromHtml(output.value)
  window.addEventListener('click', handleClick);
});

// 将 onUnmounted 移动到 setup() 的顶层
onUnmounted(() => {
  window.removeEventListener('click', handleClick);
});

</script>

<style scoped lang="scss">
img {
  width: 200px;
}
</style>


