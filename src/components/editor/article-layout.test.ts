/**
 * FilePath    : blog-client\src\components\editor\article-layout.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章编辑器栏位显示状态持久化单元测试
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { LocalStorageKey } from "@/stores/local"

import {
    clearArticleEditorVisibilityState,
    DEFAULT_ARTICLE_EDITOR_VISIBILITY_STATE,
    loadArticleEditorVisibilityState,
    normalizeArticleEditorVisibilityState,
    saveArticleEditorVisibilityState,
} from "./article-layout"

beforeEach(() => {
    localStorage.clear()
})

afterEach(() => {
    localStorage.clear()
})

describe("normalizeArticleEditorVisibilityState", () => {
    it("缺失字段会回退到默认显示状态", () => {
        expect(normalizeArticleEditorVisibilityState({ tocShow: true })).toEqual({
            ...DEFAULT_ARTICLE_EDITOR_VISIBILITY_STATE,
            tocShow: true,
        })
    })

    it("非法字段会被忽略并保留默认值", () => {
        expect(normalizeArticleEditorVisibilityState({ editorShow: "true" as never, previewShow: false })).toEqual({
            ...DEFAULT_ARTICLE_EDITOR_VISIBILITY_STATE,
            previewShow: false,
        })
    })
})

describe("saveArticleEditorVisibilityState + loadArticleEditorVisibilityState", () => {
    it("保存后可以正确读取三栏显示状态", () => {
        const state = { tocShow: true, editorShow: true, previewShow: false }
        saveArticleEditorVisibilityState(state)

        expect(loadArticleEditorVisibilityState()).toEqual(state)
    })

    it("读取到非法 JSON 时返回 null", () => {
        localStorage.setItem(LocalStorageKey.ArticleEditorVisibility, "{")

        expect(loadArticleEditorVisibilityState()).toBeNull()
    })

    it("clearArticleEditorVisibilityState 会移除已保存状态", () => {
        saveArticleEditorVisibilityState({ tocShow: true, editorShow: false, previewShow: true })

        clearArticleEditorVisibilityState()

        expect(loadArticleEditorVisibilityState()).toBeNull()
    })
})
