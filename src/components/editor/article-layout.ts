/**
 * FilePath    : blog-client\src\components\editor\article-layout.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章编辑器栏位显示状态持久化
 */

import { LocalStorageKey } from "@/stores/local"

/**
 * ArticleEditorVisibilityState 定义文章编辑器三栏的显示状态。
 */
export interface ArticleEditorVisibilityState {
    tocShow: boolean
    editorShow: boolean
    previewShow: boolean
}

export const DEFAULT_ARTICLE_EDITOR_VISIBILITY_STATE: ArticleEditorVisibilityState = {
    tocShow: false,
    editorShow: true,
    previewShow: true,
}

/**
 * isBoolean 判断传入值是否为布尔值。
 * @param value - 待判断的值。
 * @returns true 表示传入值为布尔值。
 */
function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean"
}

/**
 * normalizeArticleEditorVisibilityState 规范化文章编辑器栏位显示状态。
 * 非法字段会回退到默认值, 以保证 localStorage 中的旧数据或坏数据不会破坏布局。
 * @param state - 外部传入的显示状态。
 * @returns 合法且完整的文章编辑器栏位显示状态。
 */
export function normalizeArticleEditorVisibilityState(state?: Partial<ArticleEditorVisibilityState> | null): ArticleEditorVisibilityState {
    const normalized: ArticleEditorVisibilityState = { ...DEFAULT_ARTICLE_EDITOR_VISIBILITY_STATE }
    if (!state) {
        return normalized
    }

    if (isBoolean(state.tocShow)) {
        normalized.tocShow = state.tocShow
    }

    if (isBoolean(state.editorShow)) {
        normalized.editorShow = state.editorShow
    }

    if (isBoolean(state.previewShow)) {
        normalized.previewShow = state.previewShow
    }

    return normalized
}

/**
 * saveArticleEditorVisibilityState 保存文章编辑器栏位显示状态。
 * @param state - 当前目录区, 编辑区与预览区显示状态。
 * @returns 无返回值。
 */
export function saveArticleEditorVisibilityState(state: ArticleEditorVisibilityState): void {
    localStorage.setItem(LocalStorageKey.ArticleEditorVisibility, JSON.stringify(normalizeArticleEditorVisibilityState(state)))
}

/**
 * clearArticleEditorVisibilityState 清除文章编辑器栏位显示状态缓存。
 * @returns 无返回值。
 */
export function clearArticleEditorVisibilityState(): void {
    localStorage.removeItem(LocalStorageKey.ArticleEditorVisibility)
}

/**
 * loadArticleEditorVisibilityState 读取文章编辑器栏位显示状态。
 * @returns 读取成功时返回显示状态, 否则返回 null。
 */
export function loadArticleEditorVisibilityState(): ArticleEditorVisibilityState | null {
    const raw = localStorage.getItem(LocalStorageKey.ArticleEditorVisibility)
    if (!raw) {
        return null
    }

    try {
        return normalizeArticleEditorVisibilityState(JSON.parse(raw) as Partial<ArticleEditorVisibilityState>)
    } catch {
        return null
    }
}
