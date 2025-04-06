/*
 * FilePath    : blog-client\src\components\editor\hooks\useToolbar.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具栏 hook
 */

import { useMagicKeys } from "@vueuse/core"
import { useResizeObserver } from "@vueuse/core"
import { debounce } from "throttle-debounce"
import { computed, nextTick, onBeforeUnmount, onMounted, type Ref, ref, watch } from "vue"
import { type EmojiExt } from "vue3-emoji-picker"

import type { IconKeys } from "@/components/common/icons"
import { useWebFullscreen } from "@/components/hooks/useWebFullscreen"
import { MessageUtil } from "@/utils/message"
import { getComputedStyleValue, getCSSVariableValue, setCSSVariable } from "@/utils/style"

import { CommandsKey, markdownEditorCommands } from "../command"
import type { CodemirrorRef } from "../components/codemirror"
import type { PreviewRef } from "../components/preview"
import type { ToolbarRef } from "../components/toolbar"
import { type TableRowCol } from "../components/toolbar"
import { EditorStateManager } from "../state"
import { copyWithCustomStyle } from "../utils"

export function useToolbar(
    mdLayoutRef: Ref<HTMLElement | null>,
    mdContainerRef: Ref<HTMLElement | null>,
    toolbarRef: Ref<ToolbarRef | null>,
    codemirrorRef: Ref<CodemirrorRef | null>,
    previewRef: Ref<PreviewRef | null>,
    stateManager: EditorStateManager,
) {
    const { isWebFullscreen, toggle } = useWebFullscreen(mdLayoutRef)

    // 状态管理
    const editorState = stateManager.getState()

    // 工具栏按钮
    const toolbarBtns = computed(() => {
        return editorState.commandKeys.map((key) => {
            const hotKey = markdownEditorCommands[key].hotKey ? ` <${markdownEditorCommands[key].hotKey}>` : ""
            return {
                name: key as CommandsKey,
                display: (markdownEditorCommands[key].tip + hotKey) as string,
                icon: markdownEditorCommands[key].icon as IconKeys,
            }
        })
    })

    // 防抖处理 copyWithCustomStyle
    const debounceCopyWithCustomStyle = debounce(500, copyWithCustomStyle)

    /**
     * @description: 处理工具栏按钮点击事件
     * @param name 工具栏按钮对应的常量
     */
    const toolbarBtnClicked = async (name: CommandsKey) => {
        if (name === CommandsKey.Vim) {
            stateManager.toggleVimMode()
            return
        }
        if (name === CommandsKey.Preview) {
            stateManager.toggleEditorShow()
            if (!editorState.editorShow) {
                stateManager.setPreviewShow(true)
            }
            return
        }
        if (name === CommandsKey.Edit) {
            stateManager.togglePreviewShow()
            if (!editorState.previewShow) {
                stateManager.setEditorShow(true)
            }
            return
        }
        if (name === CommandsKey.Toc) {
            stateManager.toggleTocShow()
            return
        }
        if (name === CommandsKey.Scroll) {
            stateManager.toggleAsyncScroll()
            MessageUtil.success(editorState.isAsyncScroll ? "同步滚动" : "异步滚动")
            return
        }
        if (name === CommandsKey.Fullscreen) {
            toggle()
            stateManager.setIsFullScreen(isWebFullscreen.value)
            return
        }
        if (name === CommandsKey.Emoji) {
            return
        }
        if (name === CommandsKey.WechatOfficialAccount) {
            stateManager.toggleShowPreviewWechat()
        }
        if (name === CommandsKey.Copy) {
            await nextTick(() => {
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
            const hotKey = markdownEditorCommands[item].hotKey
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

    const toolbarHight = ref(0)

    // 计算工具栏高度
    const updateToolbarHeight = (): void => {
        if (!toolbarRef.value) return

        const toolbarEl = toolbarRef.value.root
        const height = toolbarEl.offsetHeight
        const marginTop = getComputedStyleValue(toolbarEl, "margin-top")
        const marginBottom = getComputedStyleValue(toolbarEl, "margin-bottom")

        toolbarHight.value = height + marginTop + marginBottom
    }

    // 更新 mdContainerRef 中 css 变量 --md-editor-container-height 的值
    const updateMdContainerStyle = (): void => {
        if (!mdContainerRef.value || !toolbarHight.value) return

        // 设置 cmContainerRef 中 css 变量 --md-editor-container-height 的值为 100vh - toolbar 高度 - toolbar margin
        setCSSVariable(mdContainerRef.value, "--md-editor-container-height", `calc(100vh - ${toolbarHight.value}px)`)
    }

    const calcToolbarHight = (): void => {
        updateToolbarHeight()
        updateMdContainerStyle()
    }

    // 监听窗口变化
    const { stop } = useResizeObserver(mdLayoutRef, () => {
        calcToolbarHight()
    })

    // 每行 icon 个数
    const iconNumberPerLine = () => {
        if (!toolbarRef.value) return
        const icons = getCSSVariableValue(toolbarRef.value.root, "--icon-number-per-line")
        if (!icons) return 10
        return parseInt(icons)
    }

    // 选择 emoji
    const emojiPickerSelected = (emoji: EmojiExt) => {
        codemirrorRef.value?.runCommand(CommandsKey.Emoji, {
            prefix: "",
            content: emoji.i,
            suffix: "",
        })
        stateManager.setIsShowEmojiPicker(false)
    }

    // 插入表格行列
    const insertTableRowCol = (rowCol: TableRowCol) => {
        // content: "|column1|column2|column3|\n|:---:|:---:|:---:|\n|content1|content2|content3|",
        const { row, col } = rowCol
        let content = ""

        // 表头
        for (let i = 0; i < col; i++) {
            content += "|column" + (i + 1) + (i === col - 1 ? "|\n" : "")
        }

        // 对齐方式
        content += "|"
        for (let i = 0; i < col; i++) {
            content += ":---:" + (i === col - 1 ? "|\n" : "|")
        }

        // 内容
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                content += "|content" + (j + 1) + (j === col - 1 ? "|\n" : "")
            }
        }

        // 插入表格
        codemirrorRef.value?.runCommand(CommandsKey.Table, {
            prefix: "",
            content,
            suffix: "",
        })
    }

    onMounted(() => {
        registerHotKeys() // 注册快捷键
    })

    onBeforeUnmount(() => {
        stop()
    })

    return {
        toolbarBtns,
        toolbarBtnClicked,
        calcToolbarHight,
        toolbarHight,
        iconNumberPerLine,
        emojiPickerSelected,
        insertTableRowCol,
    }
}
