/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 22:10:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-20 22:17:29
 * @FilePath     : \blog-client\src\components\common\editor\index\useToolbar.ts
 * @Description  : 工具栏 hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Ref } from 'vue'
import type { CodemirrorRef } from '@/components/common/editor/index/type'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { MardkdownEditorCommands } from '@/components/common/editor/command/constant'
import type { MardkdownEditorCommandsKeyType } from '@/components/common/editor/command/constant'
import { ShowMsgTip } from '@/utils/message'

export function useToolbar(codemirrorRef: Ref<CodemirrorRef | null>) {
  const { editorShow, previewShow, tocShow, isAsyncScroll, isFullScreen } =
    storeToRefs(useEditorStore())
  // 目标 key 常量 数组
  const constantKeys: MardkdownEditorCommandsKeyType[] = Object.keys(MardkdownEditorCommands)

  // 工具栏按钮
  const toobarBtns = () => {
    return constantKeys.map((key) => {
      return {
        name: key as string,
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
  const toolbarBtnClicked = (name: string) => {
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
