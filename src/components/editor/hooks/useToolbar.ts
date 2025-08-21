/*
 * FilePath    : blog-client\src\components\editor\hooks\useToolbar.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具栏 hook
 */

import { useMagicKeys } from "@vueuse/core"
import { computed, onMounted, type Ref, watch } from "vue"
import { type EmojiExt } from "vue3-emoji-picker"

import type { IconKeys } from "@/components/common/icons"
import { useWebFullscreen } from "@/components/hooks/useWebFullscreen"
import { MessageUtil } from "@/utils/message"
import { setCSSVariable } from "@/utils/style"

import { CommandsKey, markdownEditorCommands } from "../command"
import { Alerts, type TableRowCol } from "../components/toolbar"
import { EditorStateManager } from "../state"

export function useToolbar(mdLayoutRef: Ref<HTMLElement | null>, mdContainerRef: Ref<HTMLElement | null>, stateManager: EditorStateManager) {
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
            stateManager.toggleSyncScroll()
            MessageUtil.success(editorState.isSyncScroll ? "同步滚动" : "独立滚动")
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
            stateManager.setViewCommand({
                commandName: CommandsKey.Copy,
                time: new Date(),
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

        stateManager.setCmCommand({
            commandName: name,
            time: new Date(),
        })
    }

    /**
     * @description: 注册快捷键
     */
    const keys = useMagicKeys() // 使用 useMagicKeys() 之后，就可以通过 keys 来获取键盘按键的状态了
    const registerHotKeys = () => {
        Object.values(CommandsKey).forEach((item) => {
            const hotKey = markdownEditorCommands[item].hotKey
            if (hotKey) {
                watch(keys[hotKey]!, (v) => {
                    // v 为 true 时表示按下了快捷键 v 为 false 时释放了快捷键
                    // console.log('hotKey', hotKey, v)
                    // console.log('item[0]', item)
                    if (v) {
                        toolbarBtnClicked(item)
                    }
                })
            }
        })
    }

    // 更新 mdContainerRef 中 css 变量 --md-editor-container-height-fullscreen 的值
    const updateMdContainerStyle = (toolbarHight: string): void => {
        if (!mdContainerRef.value) return

        // 设置 cmContainerRef 中 css 变量 --md-editor-container-height-fullscreen 的值为 100vh - toolbar 高度 - toolbar margin
        setCSSVariable(mdContainerRef.value, "--md-editor-container-height-fullscreen", `calc(100vh - ${toolbarHight})`)
    }

    // 选择 emoji
    const emojiPickerSelected = (emoji: EmojiExt) => {
        stateManager.setCmCommand({
            commandName: CommandsKey.Emoji,
            customContent: {
                prefix: "",
                content: emoji.i,
                suffix: "",
            },
            time: new Date(),
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
        stateManager.setCmCommand({
            commandName: CommandsKey.Table,
            customContent: {
                prefix: "",
                content,
                suffix: "",
            },
            time: new Date(),
        })
    }

    // 插入提醒
    const insertAlert = (val: Alerts) => {
        const content = val
        stateManager.setCmCommand({
            commandName: CommandsKey.Alert,
            customContent: {
                prefix: "",
                content,
                suffix: "",
            },
            time: new Date(),
        })
    }

    onMounted(() => {
        registerHotKeys() // 注册快捷键
    })

    return {
        toolbarBtns,
        toolbarBtnClicked,
        updateMdContainerStyle,
        emojiPickerSelected,
        insertTableRowCol,
        insertAlert,
    }
}
