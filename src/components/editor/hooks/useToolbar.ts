/*
 * FilePath    : blog-client\src\components\editor\hooks\useToolbar.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具栏 hook
 */

import { useMagicKeys } from "@vueuse/core"
import { storeToRefs } from "pinia"
import { computed, onMounted, type Ref, watch } from "vue"
import { type EmojiExt } from "vue3-emoji-picker"

import type { IconKeys } from "@/components/common/icons"
import { useWebFullscreen } from "@/components/hooks/useWebFullscreen"
import { DeviceType, useDeviceStore } from "@/stores/device"
import { MessageUtil } from "@/utils/message"
import { setCSSVariable } from "@/utils/style"

import { buildPowerBiContent, buildWechatCaptchaPrefix, loadPowerBiDefaults, loadWechatCaptchaDefaults, saveVimDefaults } from "@/stores/editor-defaults"

import { CommandsKey, markdownEditorCommands } from "../command"
import { Alerts, type EditorToolbarButton, type PayTagItem, type TableRowCol } from "../components/toolbar"
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
    // 状态管理
    const editorState = stateManager.getState()
    const deviceStore = useDeviceStore()
    const { device } = storeToRefs(deviceStore)

    /**
     * shouldIgnoreFullscreenEscape 判断当前 Escape 是否应忽略网页全屏退出。
     * 当开启 Vim 模式且焦点位于 CodeMirror 内部时, 应优先交给 Vim 自己退出当前模式。
     * @param event - 当前键盘事件。
     * @returns true 表示本次 Escape 不应退出网页全屏。
     */
    const shouldIgnoreFullscreenEscape = (event: KeyboardEvent): boolean => {
        if (!editorState.vimMode) {
            return false
        }

        const target = event.target
        if (!(target instanceof HTMLElement)) {
            return false
        }

        return !!target.closest("#jpz-codemirror")
    }

    const { isWebFullscreen, toggle } = useWebFullscreen(mdLayoutRef, {
        shouldIgnoreEscape: shouldIgnoreFullscreenEscape,
    })

    /**
     * syncFullscreenState 将网页全屏状态同步回编辑器状态。
     * 这样无论是点击工具栏按钮, 还是按 Escape 退出全屏, 工具栏显示都能和真实状态保持一致。
     * @param isFullscreen - 当前网页全屏状态。
     * @returns 无返回值。
     */
    const syncFullscreenState = (isFullscreen: boolean): void => {
        stateManager.setIsFullScreen(isFullscreen)
    }

    watch(isWebFullscreen, syncFullscreenState, { immediate: true })

    /**
     * getToolbarCommandMeta 根据当前编辑器状态返回工具栏命令显示配置。
     * 全屏按钮始终保留原有的点击命令, 仅在已进入全屏时切换提示文案与图标。
     * @param key - 当前工具栏按钮命令。
     * @returns 当前按钮应展示的命令配置。
     */
    const getToolbarCommandMeta = (key: CommandsKey) => {
        if (key === CommandsKey.Fullscreen && editorState.isFullScreen) {
            return markdownEditorCommands[CommandsKey.ExitFullscreen]
        }

        return markdownEditorCommands[key]
    }

    // 工具栏按钮
    const toolbarBtns = computed<EditorToolbarButton[]>(() => {
        return editorState.commandKeys.map((key) => {
            const commandMeta = getToolbarCommandMeta(key as CommandsKey)
            const hotKey = commandMeta.hotKey ? ` <${commandMeta.hotKey}>` : ""
            return {
                name: key as CommandsKey,
                display: (commandMeta.tip + hotKey) as string,
                icon: commandMeta.icon as IconKeys,
                isExternal: false,
            }
        })
    })

    /**
     * setVimMode 更新 Vim 启用状态, 并将当前映射与开关状态一起持久化到 localStorage.
     * @param enabled - 是否启用 Vim 模式.
     * @returns 无返回值.
     */
    const setVimMode = (enabled: boolean): void => {
        stateManager.setVimMode(enabled)
        saveVimDefaults({ enabled, mappings: editorState.vimMappings })
    }

    /**
     * syncPhoneExclusiveView 在手机端切换编辑区与预览区的互斥显示状态。
     * 手机端只允许同时展示一个主面板, 避免编辑区和预览区并排挤压。
     * @param targetView - 目标展示区域, editor 表示编辑区, preview 表示预览区。
     * @returns 无返回值。
     */
    const syncPhoneExclusiveView = (targetView: "editor" | "preview"): void => {
        if (device.value !== DeviceType.PHONE) {
            return
        }

        stateManager.setEditorShow(targetView === "editor")
        stateManager.setPreviewShow(targetView === "preview")
    }

    /**
     * @description: 处理工具栏按钮点击事件
     * @param name 工具栏按钮对应的常量
     */
    const toolbarBtnClicked = async (name: CommandsKey) => {
        if (name === CommandsKey.Heading || name === CommandsKey.Tool) {
            return
        }

        if (name === CommandsKey.Vim) {
            setVimMode(!editorState.vimMode)
            return
        }

        if (name === CommandsKey.Preview) {
            if (device.value === DeviceType.PHONE) {
                syncPhoneExclusiveView("preview")
                return
            }

            stateManager.toggleEditorShow()
            if (!editorState.editorShow) {
                stateManager.setPreviewShow(true)
            }
            return
        }

        if (name === CommandsKey.Edit) {
            if (device.value === DeviceType.PHONE) {
                syncPhoneExclusiveView("editor")
                return
            }

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
            window.open("https://jiaopengzi.com/page/editor-docs", "_blank")
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

        if (name === CommandsKey.LoginView) {
            const customContent = { prefix: "\n<login-view>\n\n", content: "您的隐藏内容", suffix: "\n\n</login-view>\n" }
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

    /**
     * insertTableRowCol 按指定行列插入空白表格。
     * 表头与内容单元格统一使用固定宽度的空白占位, 并让各列在源码中保持对齐。
     */
    const insertTableRowCol = (rowCol: TableRowCol) => {
        const { row, col } = rowCol
        let content = ""
        const cellSeparator = "|"
        const alignCell = ":-----:"
        const emptyCell = "       "

        // 表头
        for (let i = 0; i < col; i++) {
            content += cellSeparator + emptyCell + (i === col - 1 ? `${cellSeparator}\n` : "")
        }

        // 对齐方式
        content += cellSeparator
        for (let i = 0; i < col; i++) {
            content += alignCell + (i === col - 1 ? `${cellSeparator}\n` : cellSeparator)
        }

        // 内容
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                content += cellSeparator + emptyCell + (j === col - 1 ? `${cellSeparator}\n` : "")
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
        setVimMode,
    }
}
