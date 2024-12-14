/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-20 22:10:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-14 12:30:23
 * @FilePath     : \blog-client\src\components\editor\core\hooks\useToolbar.ts
 * @Description  : 工具栏 hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Ref } from "vue"
import { ref, onMounted, nextTick, watch } from "vue"
import type { ToolbarRef, CodemirrorRef, PreviewRef } from "../types"
import { EditorStateManager } from "../state"
import {
    CommandsKey,
    createMarkdownEditorCommands,
    type MarkdownEditorCommands,
} from "@/components/editor/command"
import type { IconKeys } from "@/components/common/icons"
import { ShowMsgTip } from "@/utils/message"
import { getComputedStyleValue, setCSSVariable, getCSSVariableValue } from "@/utils/style"
import { copyWithCustomStyle } from "../utils"
import { debounce } from "throttle-debounce"
import { useMagicKeys } from "@vueuse/core"
import { type TableRowCol } from "@/components/editor/toolbar"
import { type EmojiExt } from "vue3-emoji-picker"

export function useToolbar(
    mdContainerRef: Ref<HTMLElement | null>,
    toolbarRef: Ref<ToolbarRef | null>,
    codemirrorRef: Ref<CodemirrorRef | null>,
    previewRef: Ref<PreviewRef | null>,
    constantKeys: CommandsKey[],
    editorStateManager: EditorStateManager,
) {
    // 状态管理
    const editorState = editorStateManager.getState()

    // 创建 markdown 编辑器命令
    const commands: MarkdownEditorCommands = createMarkdownEditorCommands()

    // 工具栏按钮
    const toolbarBtns = () => {
        return constantKeys.map((key) => {
            return {
                name: key as CommandsKey,
                display: (commands[key].tip + " <" + commands[key].hotKey + ">") as string,
                icon: commands[key].icon as IconKeys,
            }
        })
    }

    // 防抖处理 copyWithCustomStyle
    const debounceCopyWithCustomStyle = debounce(500, copyWithCustomStyle)

    /**
     * @description: 处理工具栏按钮点击事件
     * @param name 工具栏按钮对应的常量
     */
    const toolbarBtnClicked = (name: CommandsKey) => {
        if (name === CommandsKey.Preview) {
            editorStateManager.toggleEditorShow()
            if (!editorState.editorShow) {
                editorStateManager.setPreviewShow(true)
            }
            return
        }
        if (name === CommandsKey.Edit) {
            editorStateManager.togglePreviewShow()
            if (!editorState.previewShow) {
                editorStateManager.setEditorShow(true)
            }
            return
        }
        if (name === CommandsKey.Toc) {
            editorStateManager.toggleTocShow()
            return
        }
        if (name === CommandsKey.Scroll) {
            editorStateManager.toggleAsyncScroll()
            ShowMsgTip(
                ShowMsgTip.MsgType.success,
                editorState.isAsyncScroll ? "同步滚动" : "异步滚动",
            )
            return
        }
        if (name === CommandsKey.Fullscreen) {
            editorStateManager.toggleFullScreen()
            return
        }
        if (name === CommandsKey.Emoji) {
            return
        }
        if (name === CommandsKey.WechatOfficialAccount) {
            editorStateManager.toggleShowPreviewWechat()
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
            const hotKey = commands[item].hotKey
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
        setCSSVariable(
            mdContainerRef.value,
            "--md-editor-container-height",
            `calc(100vh - ${toolbarHight.value}px)`,
        )

        // 将内层的变量 --el-tabs-header-height 设置到 cmContainerRef 中 css 变量 --el-tabs-header-height
        const elTabsHeader = mdContainerRef.value.querySelector(".el-tabs__header") as HTMLElement
        if (!elTabsHeader) return

        const tabsHeaderHeight = getComputedStyleValue(elTabsHeader, "--el-tabs-header-height")
        if (!tabsHeaderHeight) return

        setCSSVariable(mdContainerRef.value, "--el-tabs-header-height", `${tabsHeaderHeight}px`)
    }

    const calcToolbarHight = (): void => {
        updateToolbarHeight()
        updateMdContainerStyle()
    }

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
        editorStateManager.setIsShowEmojiPicker(false)
    }

    // 插入表格行列
    const insertTableRowCol = (rowCol: TableRowCol) => {
        console.log("rowCol", rowCol)
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
        calcToolbarHight() // 计算工具栏高度
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
