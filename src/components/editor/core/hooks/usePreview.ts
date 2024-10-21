/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-19 15:32:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-21 20:51:18
 * @FilePath     : \blog-client\src\components\editor\core\hooks\usePreview.ts
 * @Description  : preview hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { reactive, watchEffect } from "vue"
import type { Ref } from "vue"
import type { CodemirrorRef } from "../types"
import { EditorStateManager } from "../state"
export function usePreview(
    codemirrorRef: Ref<CodemirrorRef | null>,
    editorStateManager: EditorStateManager,
) {
    // 状态管理
    const editorState = editorStateManager.getState()

    const previewData = reactive({
        html: editorState.preview,
        imgUrls: editorState.imgUrls,
        isShowElImageViewer: editorState.isShowElImageViewer,
        isUserScrollPreview: editorState.isUserScrollPreview,
    })

    const showImageViewer = (imgUrls: string[], isShowElImageViewer: boolean) => {
        editorStateManager.setImgUrls(imgUrls)
        editorStateManager.setIsShowElImageViewer(isShowElImageViewer)
    }

    const closeImageViewer = (isShowElImageViewer: boolean) => {
        editorStateManager.setIsShowElImageViewer(isShowElImageViewer)
    }

    const handleMouseInElement = (isUserScrollPreview: boolean) => {
        editorStateManager.setIsUserScrollPreview(isUserScrollPreview)
    }

    const handleHeadingShowCurrent = (headingIndex: number) => {
        editorStateManager.setHeadingShowCurrentIndex(headingIndex)

        // 当同步滚动开启和用户滚动预览时，编辑器滚动到对应行
        if (editorState.isAsyncScroll && editorState.isUserScrollPreview) {
            codemirrorRef.value?.scrollIntoViewLine(
                editorState.tocMarkdown[headingIndex].markdownLineNumber,
            )
        }
    }

    watchEffect(() => {
        previewData.html = editorState.preview
        previewData.imgUrls = editorState.imgUrls
        previewData.isShowElImageViewer = editorState.isShowElImageViewer
        previewData.isUserScrollPreview = editorState.isUserScrollPreview
    })

    return {
        previewData,
        showImageViewer,
        closeImageViewer,
        handleMouseInElement,
        handleHeadingShowCurrent,
    }
}
