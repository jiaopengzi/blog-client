/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 22:10:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-21 17:07:12
 * @FilePath     : \blog-client\src\components\common\editor\core\hooks\useToolbar.ts
 * @Description  : 工具栏 hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Ref } from 'vue'
import type { CodemirrorRef } from '@/components/common/editor/core'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { MardkdownEditorCommands } from '@/components/common/editor/command'
import { CommandsKey } from '@/components/common/editor/command'
import { ShowMsgTip } from '@/utils/message'

export function useToolbar(codemirrorRef: Ref<CodemirrorRef | null>, constantKeys: CommandsKey[]) {
  const { editorShow, previewShow, tocShow, isAsyncScroll, isFullScreen } =
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
    if (name === 'preview') {
      editorShow.value = !editorShow.value
      if (!editorShow.value) {
        previewShow.value = true
      }
      return
    }
    if (name === 'desktop') {
      previewShow.value = !previewShow.value
      if (!previewShow.value) {
        editorShow.value = true
      }
      return
    }
    if (name === 'toc') {
      tocShow.value = !tocShow.value
      return
    }
    if (name === 'scroll') {
      isAsyncScroll.value = !isAsyncScroll.value
      if (isAsyncScroll.value) {
        ShowMsgTip(ShowMsgTip.MsgType.success, '同步滚动')
      } else {
        ShowMsgTip(ShowMsgTip.MsgType.info, '异步滚动')
      }
      return
    }
    if (name === 'fullscreen') {
      isFullScreen.value = !isFullScreen.value
      return
    }

    // 调用 codemirrorRef 中的 runCommand 函数
    codemirrorRef.value?.runCommand(name)
  }

  return {
    toobarBtns,
    toolbarBtnClicked,
  }
}
