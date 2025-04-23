/*
 * FilePath    : blog-client\src\components\editor\hooks\usePreview.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : preview hook
 */

import { EditorStateManager } from "../state"

/**
 * @description: 阅览的 hook
 * @param {EditorStateManager} editorStateManager 编辑器状态管理
 */
export function usePreview(editorStateManager: EditorStateManager) {
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
    const handleMouseInPreview = (flag: boolean) => {
        // editorStateManager.setMouseStatus(flag ? "preview" : void 0)
        if (flag) {
            editorStateManager.setMouseStatus("preview")
        }
    }

    // 处理目录当前标题高亮显示
    const handleHeadingShowCurrent = (headingIndex: number) => {
        if (!editorState.isUserScrollPreview) {
            return
        }

        editorStateManager.setHeadingShowCurrentIndex(headingIndex)

        // 如果不是同步滚动就直接返回
        if (!editorState.isSyncScroll) return

        // 设置是否用户滚动预览
        editorStateManager.setIsUserScrollCmEditor(false)
    }

    // 设置是否用户滚动预览
    const handleUpdateIsUserScrollPreview = (val: boolean) => {
        editorStateManager.setIsUserScrollPreview(val)
    }

    return {
        showImageViewer,
        closeImageViewer,
        handleMouseInPreview,
        handleHeadingShowCurrent,
        handleUpdateIsUserScrollPreview,
    }
}
