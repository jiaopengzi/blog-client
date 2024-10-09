/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 16:08:44
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-21 15:36:43
 * @FilePath     : \blog-client\src\components\common\editor\core\hooks\useToc.ts
 * @Description  : toc 目录导航 hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import type { Ref } from 'vue'
import type { CodemirrorRef, PreviewRef } from '@/components/editor/core'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

export function useToc(
  codemirrorRef: Ref<CodemirrorRef | null>,
  previewRef: Ref<PreviewRef | null>
) {
  const editorStore = useEditorStore()
  const { tocMarkdown } = storeToRefs(editorStore)

  /**
   * @description: 目录导航点击事件
   * @param index 点击的目录索引
   */
  const tocHeadingClicked = (index: number) => {
    // isAsyncScroll.value = false // 点击目录时候关闭异步滚动
    codemirrorRef.value?.scrollIntoViewLine(tocMarkdown.value[index].markdownLineNumber) // 跳转编辑器选中目标行
    previewRef.value?.navigateToHeading(index) // 跳转预览选中目标行
  }

  return {
    tocHeadingClicked
  }
}
