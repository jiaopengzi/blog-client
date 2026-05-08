/*
 * FilePath    : blog-client\src\components\editor\hooks\useCodemirror.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : codemirror hook
 */

import { useResizeObserver } from "@vueuse/core"
import { debounce } from "throttle-debounce"
import { nextTick, onBeforeUnmount, type Ref, ref } from "vue"

import { getCSSVariableValue } from "@/utils/style"

import type { CodemirrorRef } from "../components/codemirror"
import { EditorStateManager } from "../state"

export function useCodemirror(mdContainerRef: Ref<HTMLElement | null>, codemirrorRef: Ref<CodemirrorRef | null>, editorStateManager: EditorStateManager) {
    // 状态管理
    const editorState = editorStateManager.getState()

    // codemirror 高度
    const cmHeight = ref<string | undefined>(void 0)

    // 更新 cmView 编辑器实例高度
    const updateCmHeightIsFullScreen = (): void => {
        if (mdContainerRef.value) {
            // 读取 mdContainerRef 容器中的 css 变量 --md-editor-container-height-fullscreen 的值
            const mdContainerHeight = getCSSVariableValue(mdContainerRef.value, "--md-editor-container-height-fullscreen")
            if (mdContainerHeight && editorState.isFullScreen) {
                cmHeight.value = mdContainerHeight
            }
        }
    }

    // 更新 cmView 编辑器实例高度 非全屏时
    const updateCmHeightNotIsFullScreen = (): void => {
        if (codemirrorRef.value && !editorState.isFullScreen) {
            // 读取 codemirror 容器中的 css 变量 --md-editor-height 的值
            cmHeight.value = getCSSVariableValue(codemirrorRef.value.root, "--md-editor-height")
            // console.log('cmHeight.value====>非全屏', isFullScreen.value, cmHeight.value)
        }
    }

    // 监听窗口变化
    const { stop } = useResizeObserver(mdContainerRef, () => {
        nextTick(() => {
            if (editorState.isFullScreen) {
                updateCmHeightIsFullScreen()
            } else {
                updateCmHeightNotIsFullScreen()
            }
        })
    })

    const handleScroll = debounce(200, (scrollHeight: number, clientHeight: number, scrollTop: number, hideDoc: string, showFirstLineNumber: number) => {
        let currentHeadingIndex = -1

        // 高亮当前标题
        for (let i = 0; i < editorState.tocMarkdown.length; i++) {
            const item = editorState.tocMarkdown[i]!
            if (showFirstLineNumber <= item.markdownLineNumber) {
                currentHeadingIndex = item.index
                break
            }
        }

        editorStateManager.setHeadingShowCurrentIndex(currentHeadingIndex)

        // 如果不是同步滚动就直接返回
        if (!editorState.isSyncScroll || editorState.mouseStatus !== "cmEditor") return

        editorStateManager.setIsUserScrollPreview(false) // 设置是否用户滚动预览

        // 滚动条在顶部时附近时
        if (scrollTop <= 4) {
            editorStateManager.setScrollStatus("start")
            return
        }

        // 滚动条在底部时附近时
        if (scrollHeight - clientHeight - scrollTop <= 4) {
            editorStateManager.setScrollStatus("end")
            return
        }

        editorStateManager.setScrollHideViewStr(hideDoc) // store 存储不可见部分的 markdown
    })

    // 设置是否用户滚动编辑器
    const handleUpdateIsUserScrollCmEditor = (val: boolean) => {
        editorStateManager.setIsUserScrollCmEditor(val)
    }

    // 鼠标进入元素
    const handleMouseInCmEditor = (flag: boolean) => {
        // editorStateManager.setMouseStatus(flag ? "cmEditor" : void 0)
        if (flag) {
            editorStateManager.setMouseStatus("cmEditor")
        }
    }

    onBeforeUnmount(() => {
        stop()
    })

    return {
        cmHeight,
        handleScroll,
        handleUpdateIsUserScrollCmEditor,
        handleMouseInCmEditor,
    }
}
