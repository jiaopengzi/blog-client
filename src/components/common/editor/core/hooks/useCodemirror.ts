/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 22:22:25
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-27 00:29:39
 * @FilePath     : \blog-client\src\components\common\editor\core\hooks\useCodemirror.ts
 * @Description  : codemirror hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import { nextTick, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { MdContainerRef, CmContainerRef, PreviewRef } from '@/components/common/editor/core'
import { ScrollElementTag } from '@/components/common/editor/command'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { debounce } from '@/utils/debounce'

export function useCodemirror(
  mdContainerRef: Ref<MdContainerRef | null>,
  cmContainerRef: Ref<CmContainerRef | null>,
  previewRef: Ref<PreviewRef | null>,
) {
  // store
  const editorStore = useEditorStore()
  const { isFullScreen, isAsyncScroll } = storeToRefs(editorStore)

  // codemirror 高度
  const cmHeight = ref<string | undefined>(void 0)

  // 更新 cmView 编辑器实例高度 全屏时
  const updateCmHeightIsFullScreen = (): void => {
    if (mdContainerRef.value && isFullScreen.value) {
      // 读取 mdContainerRef 容器中的 css 变量 --md-editor-container-height 的值
      cmHeight.value = getComputedStyle(mdContainerRef.value).getPropertyValue(
        '--md-editor-container-height',
      )
      // console.log('cmHeight.value====>全屏', isFullScreen.value, cmHeight.value)
    }
  }

  // 更新 cmView 编辑器实例高度 非全屏时
  const updateCmHeightNotIsFullScreen = (): void => {
    if (cmContainerRef.value && !isFullScreen.value) {
      // 读取 codemirror 容器中的 css 变量 --md-editor-height 的值
      cmHeight.value = getComputedStyle(cmContainerRef.value).getPropertyValue('--md-editor-height')
      // console.log('cmHeight.value====>非全屏', isFullScreen.value, cmHeight.value)
    }
  }

  watch(isFullScreen, () => {
    if (isFullScreen.value) {
      updateCmHeightIsFullScreen()
    } else {
      nextTick(() => {
        updateCmHeightNotIsFullScreen()
      })
    }
  })

  const handleScroll = (
    scrollHeight: number,
    clientHeight: number,
    scrollTop: number,
    hideDoc: string,
  ) => {
    if (!isAsyncScroll.value) return // 如果不是异步滚动就直接返回

    // 滚动条在顶部时附近时
    if (scrollTop <= 4 && previewRef.value) {
      previewRef.value?.navigateGoHome('smooth') // 跳转预览顶部
      return
    }

    // 滚动条在底部时附近时
    if (scrollHeight - clientHeight - scrollTop <= 4 && previewRef.value) {
      previewRef.value?.navigateGoEnd('smooth') // 跳转预览底部
      return
    }
    // isAsyncScroll.value = true // 异步滚动
    // TODO 当滚动的内容如 表格 br元素 等不太精确 后续优化
    editorStore.setScrollHideViewStr(hideDoc) // store 存储不可见部分的 markdown
    const hideDom = new DOMParser().parseFromString(editorStore.getScrollHideHtmlStr, 'text/html') // 隐藏的markdown解析出来的html转换为dom
    const els = hideDom.body.querySelectorAll(ScrollElementTag) // 获取隐藏的markdown解析出来的html转换为dom中的所有元素 注意要在 body 中寻找
    previewRef.value?.navigateToElement(els.length) // 跳转预览选中目标行
  }

  const debouncedHandleScroll = debounce(handleScroll, 200) // 防抖

  const updateEditorDoc = (editorDoc: string) => {
    editorStore.updateEditorStore(editorDoc) // 更新 store 中的 editor
  }

  return {
    cmHeight,
    updateCmHeightNotIsFullScreen,
    debouncedHandleScroll,
    updateEditorDoc,
  }
}
