<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-12 20:13:29
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-14 22:16:14
 * @FilePath     : \blog-client\src\views\test\preview.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-13 17:48:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-13 18:36:38
 * @FilePath     : \blog-client\src\views\test\Index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- eslint-disable vue/multi-word-component-names -->
<!--
 * @Author       : jiaopengzi
 * @Date         : 2023-12-01 22:04:48
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-13 17:40:38
 * @FilePath     : \blog-client\src\views\test\Index.vue
 * @Description  : 
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
-->
<!-- App.vue -->
<template>
  <div class="preview">
    <Preview v-if="previewData.html" :preview="previewData" @show-image-viewer="showImageViewer"
      @close-image-viewer="closeImageViewer" />
  </div>
</template>

<script lang="ts" setup>
import Preview from '@/components/common/editor/Preview.vue'
import { onMounted, reactive, watchEffect } from 'vue';
import axios from 'axios'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'


// 获取用户信息
const editorStore = useEditorStore()


let { preview, imgUrls: imgUrlsStore, isShowElImageViewer: isShowElImageViewerStore } = storeToRefs(editorStore)
const previewData = reactive({
  html: preview.value,
  imgUrls: imgUrlsStore.value,
  isShowElImageViewer: isShowElImageViewerStore.value,
});

watchEffect(() => {
  previewData.html = preview.value;
  previewData.imgUrls = imgUrlsStore.value;
  previewData.isShowElImageViewer = isShowElImageViewerStore.value;
});


const showImageViewer = (imgUrls: string[], isShowElImageViewer: boolean) => {
  console.log(imgUrls)
  console.log(isShowElImageViewer)
  imgUrlsStore.value = imgUrls
  isShowElImageViewerStore.value = isShowElImageViewer
}

const closeImageViewer = (isShowElImageViewer: boolean) => {
  isShowElImageViewerStore.value = isShowElImageViewer
}

const initializeEditorState = async () => {
  const res = await axios.get('src/assets/example/markdown.md').then(res => {
    editorStore.updateEditorStore(res.data) // 更新 store 中的 editor
  })
}

onMounted(async () => {
  await initializeEditorState()
})



</script>

<style scoped lang="scss"></style>
