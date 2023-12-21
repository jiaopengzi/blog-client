/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 22:41:35
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-20 22:43:57
 * @FilePath     : \blog-client\src\components\common\editor\index\usePreview.ts
 * @Description  : preview hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { reactive, watchEffect } from 'vue'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

export function usePreview() {
  // 获取用户信息
  const editorStore = useEditorStore()

  const {
    preview,
    imgUrls: imgUrlsStore,
    isShowElImageViewer: isShowElImageViewerStore,
  } = storeToRefs(editorStore)

  const previewData = reactive({
    html: preview.value,
    imgUrls: imgUrlsStore.value,
    isShowElImageViewer: isShowElImageViewerStore.value,
  })

  const showImageViewer = (imgUrls: string[], isShowElImageViewer: boolean) => {
    console.log(imgUrls)
    console.log(isShowElImageViewer)
    imgUrlsStore.value = imgUrls
    isShowElImageViewerStore.value = isShowElImageViewer
  }

  const closeImageViewer = (isShowElImageViewer: boolean) => {
    isShowElImageViewerStore.value = isShowElImageViewer
  }

  watchEffect(() => {
    previewData.html = preview.value
    previewData.imgUrls = imgUrlsStore.value
    previewData.isShowElImageViewer = isShowElImageViewerStore.value
  })

  return {
    previewData,
    showImageViewer,
    closeImageViewer,
  }
}
