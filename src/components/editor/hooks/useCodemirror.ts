/*
 * FilePath    : blog-client-nuxt\src\components\editor\hooks\useCodemirror.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : CodeMirror 编辑器高度与滚动同步 hook
 */

import { useResizeObserver } from "@vueuse/core"
import { debounce } from "throttle-debounce"
import { nextTick, onBeforeUnmount, type Ref, ref } from "vue"

import { getCSSVariableValue } from "@/utils/style"

import type { CodemirrorRef } from "../components/codemirror"
import { EditorStateManager } from "../state"

export function useCodemirror(mdContainerRef: Ref<HTMLElement | null>, codemirrorRef: Ref<CodemirrorRef | null>, editorStateManager: EditorStateManager) {
    const editorState = editorStateManager.getState()

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
        }
    }

    // 监听容器尺寸变化
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

        editorStateManager.setIsUserScrollPreview(false)

        // 滚动条位于顶部附近时
        if (scrollTop <= 4) {
            editorStateManager.setScrollStatus("start")
            return
        }

        // 滚动条位于底部附近时
        if (scrollHeight - clientHeight - scrollTop <= 4) {
            editorStateManager.setScrollStatus("end")
            return
        }

        editorStateManager.setScrollHideViewStr(hideDoc) // 存储不可见部分的 markdown
    })

    // 设置是否用户滚动编辑器
    const handleUpdateIsUserScrollCmEditor = (val: boolean) => {
        editorStateManager.setIsUserScrollCmEditor(val)
    }

    // 鼠标进入元素
    const handleMouseInCmEditor = (flag: boolean) => {
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
