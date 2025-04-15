/*
 * FilePath    : blog-client\src\components\editor\hooks\usePreview.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : preview hook
 */

import type { Ref } from "vue"

import type { CodemirrorRef } from "../components/codemirror"
import { EditorStateManager } from "../state"

// // @description: toc 目录导航点击事件
// export interface TocStatus {
//     state: Reactive<EditorState> // 状态
//     previewRef?: ComputedRef<PreviewRef | undefined> | Ref<PreviewRef | null> // 预览引用
//     codemirrorRef?: Ref<CodemirrorRef | null> // 编辑器引用
// }

/**
 * @description: 阅览的 hook
 * @param {EditorStateManager} editorStateManager 编辑器状态管理
 * @param {Ref<CodemirrorRef>} codemirrorRef 编辑器引用, 默认不传
 */
export function usePreview(editorStateManager: EditorStateManager, codemirrorRef: Ref<CodemirrorRef | null> | null = null) {
    // 状态管理
    const editorState = editorStateManager.getState()

    // 显示图片预览
    const showImageViewer = (imgUrls: string[], isShowElImageViewer: boolean) => {
        editorStateManager.setImgUrls(imgUrls)
        editorStateManager.setIsShowElImageViewer(isShowElImageViewer)
    }

    // 关闭图片预览
    const closeImageViewer = (isShowElImageViewer: boolean) => {
        editorStateManager.setIsShowElImageViewer(isShowElImageViewer)
    }

    // 鼠标进入元素
    const handleMouseInElement = (isUserScrollPreview: boolean) => {
        editorStateManager.setIsUserScrollPreview(isUserScrollPreview)
    }

    // 处理目录当前标题高亮显示
    const handleHeadingShowCurrent = (headingIndex: number) => {
        editorStateManager.setHeadingShowCurrentIndex(headingIndex)

        // 当同步滚动开启和用户滚动预览时，编辑器滚动到对应行
        if (!codemirrorRef || !codemirrorRef.value) {
            return
        }
        if (editorState.isAsyncScroll && editorState.isUserScrollPreview && editorState.tocMarkdown && editorState.tocMarkdown[headingIndex]) {
            codemirrorRef.value.scrollIntoViewLine(editorState.tocMarkdown[headingIndex].markdownLineNumber)
        }
    }

    return {
        showImageViewer,
        closeImageViewer,
        handleMouseInElement,
        handleHeadingShowCurrent,
    }
}
