/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-19 15:32:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-19 15:35:27
 * @FilePath     : \blog-client\src\components\editor\core\hooks\usePreview.ts
 * @Description  : preview hook
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { reactive } from "vue"
import type { EditorState } from "../types"
import { EditorStateManager } from "../state"
export function usePreview(editorState: EditorState) {
    // 状态管理
    const localEditorState = reactive(editorState)
    const localManager = new EditorStateManager(localEditorState)

    const previewData = reactive({
        html: localEditorState.preview,
        imgUrls: localEditorState.imgUrls,
        isShowElImageViewer: localEditorState.isShowElImageViewer,
    })

    const showImageViewer = (imgUrls: string[], isShowElImageViewer: boolean) => {
        localManager.setImgUrls(imgUrls)
        localManager.setIsShowElImageViewer(isShowElImageViewer)
    }

    const closeImageViewer = (isShowElImageViewer: boolean) => {
        localManager.setIsShowElImageViewer(isShowElImageViewer)
    }

    return {
        previewData,
        showImageViewer,
        closeImageViewer,
    }
}
