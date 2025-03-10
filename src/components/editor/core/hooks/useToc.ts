/**
 * @FilePath     : \blog-client\src\components\editor\core\hooks\useToc.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : toc 目录导航 hook
 */

import type { Ref } from "vue"

import { EditorStateManager } from "../state"
import type { CodemirrorRef, PreviewRef } from "../types"

export function useToc(codemirrorRef: Ref<CodemirrorRef | null>, previewRef: Ref<PreviewRef | null>, editorStateManager: EditorStateManager) {
    // 状态管理
    const editorState = editorStateManager.getState()

    /**
     * @description: 目录导航点击事件
     * @param index 点击的目录索引
     */
    const tocHeadingClicked = (index: number) => {
        // isAsyncScroll.value = false // 点击目录时候关闭异步滚动
        codemirrorRef.value?.scrollIntoViewLine(editorState.tocMarkdown[index].markdownLineNumber) // 跳转编辑器选中目标行
        previewRef.value?.navigateToHeading(index) // 跳转预览选中目标行
    }

    return {
        tocHeadingClicked,
    }
}
