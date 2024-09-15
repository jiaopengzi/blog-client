/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 22:10:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-08 13:59:45
 * @FilePath     : \blog-client\src\components\editor\core\hooks\useToolbar.ts
 * @Description  : 工具栏 hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Ref } from 'vue'
import { ref, onMounted, nextTick, watch } from 'vue'
import type { ToolbarRef, CodemirrorRef, PreviewRef } from '@/components/editor/core'
import { CommandsKey, MardkdownEditorCommands } from '@/components/editor/command'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import type { IconKeys } from '@/components/common/icons'
import { ShowMsgTip } from '@/utils/message'
import { getComputedStyleValue, setCSSVariable, getCSSVariableValue } from '@/utils/style'
import { copyWithCustomStyle } from '@/utils/preview'
import { debounce } from 'throttle-debounce'
import { useMagicKeys } from '@vueuse/core'

export function useToolbar(
  mdContainerRef: Ref<HTMLElement | null>,
  toolbarRef: Ref<ToolbarRef | null>,
  codemirrorRef: Ref<CodemirrorRef | null>,
  previewRef: Ref<PreviewRef | null>,
  constantKeys: CommandsKey[],
) {
  const { editorShow, previewShow, tocShow, isAsyncScroll, isFullScreen, isShowPreviewWechat } =
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
        icon: MardkdownEditorCommands[key].icon as IconKeys,
      }
    })
  }

  const debounceCopyWithCustomStyle = debounce(500, copyWithCustomStyle) // 防抖

  /**
   * @description: 处理工具栏按钮点击事件
   * @param name 工具栏按钮对应的常量
   */
  const toolbarBtnClicked = (name: CommandsKey) => {
    if (name === CommandsKey.Preview) {
      editorShow.value = !editorShow.value
      if (!editorShow.value) {
        previewShow.value = true
      }
      return
    }
    if (name === CommandsKey.Edit) {
      previewShow.value = !previewShow.value
      if (!previewShow.value) {
        editorShow.value = true
      }
      return
    }
    if (name === CommandsKey.Toc) {
      tocShow.value = !tocShow.value
      return
    }
    if (name === CommandsKey.Scroll) {
      isAsyncScroll.value = !isAsyncScroll.value
      ShowMsgTip(ShowMsgTip.MsgType.success, isAsyncScroll.value ? '同步滚动' : '异步滚动')
      return
    }
    if (name === CommandsKey.Fullscreen) {
      isFullScreen.value = !isFullScreen.value
      return
    }
    if (name === CommandsKey.Emoji) {
      return
    }
    if (name === CommandsKey.WechatOfficialAccount) {
      isShowPreviewWechat.value = !isShowPreviewWechat.value
    }
    if (name === CommandsKey.Copy) {
      nextTick(() => {
        if (!previewRef.value) return
        debounceCopyWithCustomStyle(previewRef.value.root)
      })
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

  /**
   * @description: 注册快捷键
   */
  const keys = useMagicKeys() // 使用 useMagicKeys() 之后，就可以通过 keys 来获取键盘按键的状态了
  const registerHotKeys = () => {
    Object.values(CommandsKey).forEach((item) => {
      const hotKey = MardkdownEditorCommands[item].hotKey
      if (hotKey) {
        watch(keys[hotKey], (v) => {
          // v 为 true 时表示按下了快捷键 v 为 false 时释放了快捷键
          // console.log('hotKey', hotKey, v)
          // console.log('item[0]', item)
          if (v) toolbarBtnClicked(item)
        })
      }
    })
  }

  const toolBarHight = ref(0)

  // 计算工具栏高度
  const updateToolBarHeight = (): void => {
    if (!toolbarRef.value) return

    const toolbarEl = toolbarRef.value.root
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
    const icons = getCSSVariableValue(toolbarRef.value.root, '--icon-number-per-line')
    if (!icons) return 10
    return parseInt(icons)
  }

  onMounted(() => {
    registerHotKeys() // 注册快捷键
    caclToolBarHight() // 计算工具栏高度
  })

  return {
    toobarBtns,
    toolbarBtnClicked,
    caclToolBarHight,
    toolBarHight,
    iconNumberPerLine,
  }
}
