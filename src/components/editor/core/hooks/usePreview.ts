/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-19 15:32:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-20 10:31:55
 * @FilePath     : \blog-client\src\components\editor\core\hooks\usePreview.ts
 * @Description  : preview hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { reactive, watchEffect } from "vue"
import { EditorStateManager } from "../state"
export function usePreview(editorStateManager: EditorStateManager) {
    // 状态管理
    const editorState = editorStateManager.getState()

    const previewData = reactive({
        html: editorState.preview,
        imgUrls: editorState.imgUrls,
        isShowElImageViewer: editorState.isShowElImageViewer,
    })

    const showImageViewer = (imgUrls: string[], isShowElImageViewer: boolean) => {
        editorStateManager.setImgUrls(imgUrls)
        editorStateManager.setIsShowElImageViewer(isShowElImageViewer)
    }

    const closeImageViewer = (isShowElImageViewer: boolean) => {
        editorStateManager.setIsShowElImageViewer(isShowElImageViewer)
    }

    watchEffect(() => {
        previewData.html = editorState.preview
        previewData.imgUrls = editorState.imgUrls
        previewData.isShowElImageViewer = editorState.isShowElImageViewer
    })

    return {
        previewData,
        showImageViewer,
        closeImageViewer,
    }
}
