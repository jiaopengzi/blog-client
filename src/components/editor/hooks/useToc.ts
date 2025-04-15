/*
 * FilePath    : blog-client\src\components\editor\hooks\useToc.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : toc 目录导航 hook
 */

import type { ComputedRef, Reactive, Ref } from "vue"

import type { CodemirrorRef } from "../components/codemirror"
import type { PreviewRef } from "../components/preview"
import type { EditorState } from "../types"

// @description: toc 目录导航点击事件
export interface TocStatus {
    state: Reactive<EditorState> // 状态
    previewRef?: ComputedRef<PreviewRef | undefined> | Ref<PreviewRef | null> // 预览引用
    codemirrorRef?: Ref<CodemirrorRef | null> // 编辑器引用
}

export function useToc(tocStatus: TocStatus) {
    /**
     * @description: 目录导航点击事件
     * @param index 点击的目录索引
     */
    const tocHeadingClicked = (index: number) => {
        const { state, previewRef, codemirrorRef } = tocStatus

        // 跳转预览选中目标行
        if (previewRef && previewRef.value) {
            previewRef.value?.navigateToHeading(index)
        }

        // 跳转编辑器选中目标行
        if (codemirrorRef && codemirrorRef.value) {
            codemirrorRef.value?.scrollIntoViewLine(state.tocMarkdown[index].markdownLineNumber)
        }
    }

    return {
        tocHeadingClicked,
    }
}
