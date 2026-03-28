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

import { buildPowerBiContent, buildWechatCaptchaPrefix, loadPowerBiDefaults, loadWechatCaptchaDefaults } from "@/stores/editor-defaults"

import { CommandsKey, markdownEditorCommands } from "../command"
import { Alerts, type PayTagItem, type TableRowCol } from "../components/toolbar"
import { EditorStateManager } from "../state"

export function useToolbar(
    mdLayoutRef: Ref<HTMLElement | null>,
    mdContainerRef: Ref<HTMLElement | null>,
    stateManager: EditorStateManager,
    isEnableCopyCache: boolean = false,
    getCopyState: () => { hasPreparedCopyCache: boolean; copyPreparationInFlight: boolean } = () => ({
        hasPreparedCopyCache: false,
        copyPreparationInFlight: false,
    }),
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

    /**
     * @description: 处理工具栏按钮点击事件
     * @param name 工具栏按钮对应的常量
     */
    const toolbarBtnClicked = async (name: CommandsKey) => {
        if (name === CommandsKey.Heading || name === CommandsKey.Tool) {
            return
        }

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
            // 开启预复制缓存时，非微信模式且无有效缓存则拦截并提示，避免复制出 web 模式内容
            if (isEnableCopyCache && !editorState.isShowPreviewWechat) {
                const { hasPreparedCopyCache, copyPreparationInFlight } = getCopyState()
                if (!hasPreparedCopyCache && !copyPreparationInFlight) {
                    MessageUtil.warning("内容预处理尚未就绪，请编辑内容后稍候片刻再复制！")
                    return
                }
            }

            stateManager.setViewCommand({
                commandName: CommandsKey.Copy,
                time: new Date(),
            })
        }

        if (name === CommandsKey.Help) {
            // 跳转到指定链接
            window.open("https://jiaopengzi.com", "_blank")
            return
        }

        // if (name === CommandsKey.save) {
        //   isShowPreviewWechat.value = !isShowPreviewWechat.value
        //   if (isShowPreviewWechat.value) return
        //   const contentElement = document.getElementById('preview')
        //   if (contentElement) {
        //     copyToX(contentElement)
        //   }
        // }

        if (name === CommandsKey.PowerBi) {
            const defaults = loadPowerBiDefaults()
            const customContent = { prefix: "", content: buildPowerBiContent(defaults), suffix: "" }
            stateManager.setCmCommand({ commandName: name, customContent, time: new Date() })
            return
        }

        if (name === CommandsKey.WechatCaptcha) {
            const defaults = loadWechatCaptchaDefaults()
            const customContent = { prefix: buildWechatCaptchaPrefix(defaults), content: "您的隐藏内容", suffix: "\n\n</wechat-captcha>\n" }
            stateManager.setCmCommand({ commandName: name, customContent, time: new Date() })
            return
        }

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
                    // 当开启快捷键功能时才响应
                    if (v && editorState.isShortcutKey) {
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

    // 插入付费组件
    const insertPay = (val: PayTagItem) => {
        const content = val
        stateManager.setCmCommand({
            commandName: CommandsKey.PayContent,
            customContent: {
                prefix: `${content.prefix}`,
                content: `${content.content}`,
                suffix: `${content.suffix}`,
            },
            time: new Date(),
        })
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
        insertPay,
        emojiPickerSelected,
        insertTableRowCol,
        insertAlert,
    }
}
