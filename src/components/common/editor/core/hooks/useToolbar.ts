/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 22:10:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-26 21:44:37
 * @FilePath     : \blog-client\src\components\common\editor\core\hooks\useToolbar.ts
 * @Description  : 工具栏 hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Ref } from 'vue'
import { ref, onMounted } from 'vue'
import type { MdContainerRef, ToolbarRef, CodemirrorRef } from '@/components/common/editor/core'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { MardkdownEditorCommands } from '@/components/common/editor/command'
import { CommandsKey } from '@/components/common/editor/command'
import { ShowMsgTip } from '@/utils/message'

export function useToolbar(
  mdContainerRef: Ref<MdContainerRef | null>,
  toolbarRef: Ref<ToolbarRef | null>,
  codemirrorRef: Ref<CodemirrorRef | null>,
  constantKeys: CommandsKey[],
) {
  const { editorShow, previewShow, tocShow, isAsyncScroll, isFullScreen, inShowEmojiPicker } =
    storeToRefs(useEditorStore())

  // 工具栏按钮
  const toobarBtns = () => {
    return constantKeys.map((key) => {
      return {
        name: key as CommandsKey,
        display: (MardkdownEditorCommands[key].tip +
          ' <' +
          MardkdownEditorCommands[key].hotKey +
          '>') as string,
        icon: key as string,
      }
    })
  }

  /**
   * @description: 处理工具栏按钮点击事件
   * @param name 工具栏按钮对应的常量
   */
  const toolbarBtnClicked = (name: CommandsKey) => {
    if (name === CommandsKey.preview) {
      editorShow.value = !editorShow.value
      if (!editorShow.value) {
        previewShow.value = true
      }
      return
    }
    if (name === CommandsKey.desktop) {
      previewShow.value = !previewShow.value
      if (!previewShow.value) {
        editorShow.value = true
      }
      return
    }
    if (name === CommandsKey.toc) {
      tocShow.value = !tocShow.value
      return
    }
    if (name === CommandsKey.scroll) {
      isAsyncScroll.value = !isAsyncScroll.value
      ShowMsgTip(ShowMsgTip.MsgType.success, isAsyncScroll.value ? '同步滚动' : '异步滚动')
      return
    }
    if (name === CommandsKey.fullscreen) {
      isFullScreen.value = !isFullScreen.value
      return
    }
    if (name === CommandsKey.emoji) {
      inShowEmojiPicker.value = !inShowEmojiPicker.value
      return
    }

    // 调用 codemirrorRef 中的 runCommand 函数
    codemirrorRef.value?.runCommand(name)
  }

  const toolBarHight = ref(0)
  const caclToolBarHight = () => {
    if (toolbarRef.value) {
      // 获取 toolbar 高度和 margin
      const height = toolbarRef.value.$el.offsetHeight
      const marginTop = parseFloat(getComputedStyle(toolbarRef.value.$el).marginTop)
      const marginBottom = parseFloat(getComputedStyle(toolbarRef.value.$el).marginBottom)

      // 设置 cmContainerRef 中 css 变量 --md-editor-container-height 的值 为 100vh - toolbar 高度 - toolbar margin
      mdContainerRef.value?.style.setProperty(
        '--md-editor-container-height',
        `calc(100vh - ${height + marginTop + marginBottom}px)`,
      )

      toolBarHight.value = height + marginTop + marginBottom
      console.log('toolBarHight.value====>', isFullScreen.value, toolBarHight.value)
    }
  }

  // 每行 icon 个数
  const iconNumberPerLine = () => {
    if (!toolbarRef.value) return
    const icons = getComputedStyle(toolbarRef.value.$el).getPropertyValue('--icon-number-per-line')
    console.log('iconNumberPerLine====>', icons)
    if (!icons) return 10
    return parseInt(icons)
  }

  onMounted(() => {
    caclToolBarHight()
  })

  return {
    toobarBtns,
    toolbarBtnClicked,
    caclToolBarHight,
    toolBarHight,
    iconNumberPerLine,
  }
}
