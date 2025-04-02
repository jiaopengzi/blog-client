/*
 * FilePath    : blog-client\src\components\editor\hooks\useCodemirror.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : codemirror hook
 */

import { debounce } from "throttle-debounce"
import type { Ref } from "vue"
import { nextTick, ref, watch } from "vue"

import { ScrollElementTag } from "@/components/editor/command"
import { getCSSVariableValue } from "@/utils/style"

import type { CodemirrorRef } from "../components/codemirror"
import type { PreviewRef } from "../components/preview"
import { EditorStateManager } from "../state"
import { htmlHandleCopyBtns } from "../utils"

export function useCodemirror(
    mdContainerRef: Ref<HTMLElement | null>,
    codemirrorRef: Ref<CodemirrorRef | null>,
    previewRef: Ref<PreviewRef | null>,
    editorStateManager: EditorStateManager,
) {
    // 状态管理
    const editorState = editorStateManager.getState()

    // codemirror 高度
    const cmHeight = ref<string | undefined>(void 0)

    // 更新 cmView 编辑器实例高度 全屏时
    const updateCmHeightIsFullScreen = (): void => {
        if (mdContainerRef.value && editorState.isFullScreen) {
            // 读取 mdContainerRef 容器中的 css 变量 --md-editor-container-height 的值
            const mdContainerHeight = getCSSVariableValue(mdContainerRef.value, "--md-editor-container-height")
            if (mdContainerHeight) {
                cmHeight.value = mdContainerHeight
            }
            // 读取 mdContainerRef 容器中的 css 变量 --el-tabs-header-height 的值
            const elTabsHeaderHeight = getCSSVariableValue(mdContainerRef.value, "--el-tabs-header-height")
            if (elTabsHeaderHeight) {
                cmHeight.value = `calc(${cmHeight.value} - ${elTabsHeaderHeight})`
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

    // 监控是否全屏状态变化，切换全屏时更新编辑器高度
    watch(
        () => editorState.isFullScreen,
        (isFullScreen) => {
            if (isFullScreen) {
                updateCmHeightIsFullScreen()
            } else {
                nextTick(() => {
                    updateCmHeightNotIsFullScreen()
                })
            }
        },
    )

    const handleScroll = debounce(200, (scrollHeight: number, clientHeight: number, scrollTop: number, hideDoc: string, showFirstLineNumber: number) => {
        // 高亮当前标题
        for (let i = 0; i < editorState.tocMarkdown.length; i++) {
            const item = editorState.tocMarkdown[i]
            if (showFirstLineNumber <= item.markdownLineNumber) {
                editorStateManager.setHeadingShowCurrentIndex(item.index)
                break
            }
        }

        if (!editorState.isAsyncScroll) return // 如果不是异步滚动就直接返回
        if (editorState.isUserScrollPreview) return // 如果用户滚动预览就直接返回

        // 滚动条在顶部时附近时
        if (scrollTop <= 4 && previewRef.value) {
            previewRef.value?.navigateGoHome("smooth") // 跳转预览顶部
            return
        }

        // 滚动条在底部时附近时
        if (scrollHeight - clientHeight - scrollTop <= 4 && previewRef.value) {
            previewRef.value?.navigateGoEnd("smooth") // 跳转预览底部
            return
        }

        // isAsyncScroll.value = true // 异步滚动
        // TODO 当滚动的内容如 表格 br元素 等不太精确 后续优化
        editorStateManager.setScrollHideViewStr(hideDoc) // store 存储不可见部分的 markdown

        let html = editorStateManager.getScrollHideHtmlStr // 获取不可见部分的 markdown 解析出来的 html

        // 如果是微信预览模式就去掉复制按钮
        if (editorState.isShowPreviewWechat) {
            html = htmlHandleCopyBtns(html)
        }

        const hideDom = new DOMParser().parseFromString(html, "text/html") // 隐藏的markdown解析出来的html转换为dom
        const els = hideDom.body.querySelectorAll(ScrollElementTag) // 获取隐藏的markdown解析出来的html转换为dom中的所有元素 注意要在 body 中寻找
        previewRef.value?.navigateToElement(els.length) // 跳转预览选中目标行
    })

    return {
        cmHeight,
        updateCmHeightNotIsFullScreen,
        handleScroll,
    }
}
