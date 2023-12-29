/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 22:10:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-28 20:35:33
 * @FilePath     : \blog-client\src\components\common\editor\core\hooks\useToolbar.ts
 * @Description  : 工具栏 hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Ref } from 'vue'
import { ref, onMounted } from 'vue'
import type {
  MdContainerRef,
  ToolbarRef,
  CodemirrorRef,
  PreviewRef,
} from '@/components/common/editor/core'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { MardkdownEditorCommands } from '@/components/common/editor/command'
import { CommandsKey } from '@/components/common/editor/command'
import type { IconKeys } from '@/components/common/icons'
import { ShowMsgTip } from '@/utils/message'
import { getComputedStyleValue, setCSSVariable, getCSSVariableValue } from '@/utils/style'
import { copyWithCustomStyle } from '@/utils/preview'

export function useToolbar(
  mdContainerRef: Ref<MdContainerRef | null>,
  toolbarRef: Ref<ToolbarRef | null>,
  codemirrorRef: Ref<CodemirrorRef | null>,
  previewRef: Ref<PreviewRef | null>,
  constantKeys: CommandsKey[],
) {
  const {
    editorShow,
    previewShow,
    tocShow,
    isAsyncScroll,
    isFullScreen,
    isShowEmojiPicker,
    isShowPreviewWechat,
  } = storeToRefs(useEditorStore())

  // 工具栏按钮
  const toobarBtns = () => {
    return constantKeys.map((key) => {
      return {
        name: key as CommandsKey,
        display: (MardkdownEditorCommands[key].tip +
          ' <' +
          MardkdownEditorCommands[key].hotKey +
          '>') as string,
        icon: MardkdownEditorCommands[key].icon as IconKeys,
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
    if (name === CommandsKey.edit) {
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
      isShowEmojiPicker.value = !isShowEmojiPicker.value
      return
    }
    if (name === CommandsKey.WeChatOfficialAccount) {
      isShowPreviewWechat.value = !isShowPreviewWechat.value
      if (isShowPreviewWechat.value) return
      const contentElement = document.getElementById('preview')
      // const cssHtml = cssToInline(contentElement?.innerHTML || '')
      // console.log('cssHtml', cssHtml)
      if (contentElement) {
        // copyToClipboard(contentElement)
        copyWithCustomStyle(contentElement)
      }
    }
    // if (name === CommandsKey.save) {
    //   isShowPreviewWechat.value = !isShowPreviewWechat.value
    //   if (isShowPreviewWechat.value) return
    //   const contentElement = document.getElementById('preview')
    //   if (contentElement) {
    //     copyToX(contentElement)
    //   }
    // }

    // 调用 codemirrorRef 中的 runCommand 函数
    codemirrorRef.value?.runCommand(name)
  }

  const toolBarHight = ref(0)

  // 计算工具栏高度
  const updateToolBarHeight = (): void => {
    if (!toolbarRef.value) return

    const toolbarEl = toolbarRef.value.$el
    const height = toolbarEl.offsetHeight
    const marginTop = getComputedStyleValue(toolbarEl, 'margin-top')
    const marginBottom = getComputedStyleValue(toolbarEl, 'margin-bottom')

    toolBarHight.value = height + marginTop + marginBottom
  }

  // 更新 mdContainerRef 中 css 变量 --md-editor-container-height 的值
  const updateMdContainerStyle = (): void => {
    if (!mdContainerRef.value || !toolBarHight.value) return

    // 设置 cmContainerRef 中 css 变量 --md-editor-container-height 的值为 100vh - toolbar 高度 - toolbar margin
    setCSSVariable(
      mdContainerRef.value,
      '--md-editor-container-height',
      `calc(100vh - ${toolBarHight.value}px)`,
    )

    // 将内层的变量 --el-tabs-header-height 设置到 cmContainerRef 中 css 变量 --el-tabs-header-height
    const elTabsHeader = mdContainerRef.value.querySelector('.el-tabs__header') as HTMLElement
    if (!elTabsHeader) return

    const tabsHeaderHeight = getComputedStyleValue(elTabsHeader, '--el-tabs-header-height')
    if (!tabsHeaderHeight) return

    setCSSVariable(mdContainerRef.value, '--el-tabs-header-height', `${tabsHeaderHeight}px`)
  }

  const caclToolBarHight = (): void => {
    updateToolBarHeight()
    updateMdContainerStyle()
  }

  // 每行 icon 个数
  const iconNumberPerLine = () => {
    if (!toolbarRef.value) return
    const icons = getCSSVariableValue(toolbarRef.value.$el, '--icon-number-per-line')
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
